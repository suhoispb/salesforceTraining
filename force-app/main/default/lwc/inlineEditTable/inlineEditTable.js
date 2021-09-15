import { LightningElement, track, wire } from 'lwc';
import getListOfAccounts from "@salesforce/apex/accountController.getListOfAccounts";
import { refreshApex } from "@salesforce/apex";
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columns = [
    { label: "Name", fieldName: "Name", editable: true},
    { label: 'Rating', fieldName: 'Rating', type: 'picklist', typeAttributes: {
                placeholder: 'Choose rating', options: [
                { label: 'Hot', value: 'Hot' },
                { label: 'Warm', value: 'Warm' },
                { label: 'Cold', value: 'Cold' },
                { label: '--None--', value: '' }
            ] 
            , value: { fieldName: 'Rating' } 
            , context: { fieldName: 'Id' } 
        }
    },
    { label: "Delete", type: "button-icon", fixedWidth: 60, typeAttributes: {
        iconName: "utility:delete",
        name: "delete_record",
        title: "delete",
        variant: "border-filled",
        alternativeText: "delete"
      }
    }
  ];

export default class InlineEditTable extends LightningElement {
    columns = columns;
    @track accounts;

    @track showModal = false;
    @track record = {};
    @track wiredAccontList = [];

    draftValues=[];
    value;
    context;
    showPicklist = false;
    updateDrafts;
    lastSavedData=[];
    acitveFieldId;

    
    updateDataValues(updateItem) {
        let copyData = [... this.accounts];
        copyData.map(item => {
            if (item.Id === updateItem.Id) {
                updateRecord(updateItem).then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Contact updated',
                            variant: 'success'
                        })
                    );
                    return refreshApex(this.wiredAccontList).then(() => {
                        this.draftValues =[];
                    }); 
                }).catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error updating or reloading record',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                })
                }
            }
        );
    }

    handleCancel(event) {
        this.accounts = this.lastSavedData;
        this.draftValues =[];
    }

    updateDraftValues(updateItem) {
        let draftValueChanged = false;
        let copyDraftValues = [...this.draftValues];
        copyDraftValues.forEach(item => {
            // сравнивается id аккаунта которое пришло с сервера,
            // с id которое пришло с кастомной таблицы
            if (item.Id === updateItem.Id) {
                console.log('item.Id:', item.Id)
                console.log('updateItem.Id:', updateItem.Id)
                for (let field in updateItem) {
                    // field - то поле которое мы изменяем
                    // unpdateItem - объект который пришел с 
                    // onpicklistchange
                    // item[field] - поле Account
                    // updateItem[field] - тоже поле Account
                    item[field] = updateItem[field];
                    console.log('field:', field)
                    console.log('updateItem:', updateItem)
                    console.log('item[field]:', item[field])
                    console.log('updateItem[field]:', updateItem[field])
                }
                draftValueChanged = true;
                
            }             
        });
        console.log('copyDraftValues', copyDraftValues);
        if (draftValueChanged) {
            this.draftValues = [...copyDraftValues];
        } else {
            this.draftValues = [...copyDraftValues, updateItem];
        }
    }

    picklistChanged(event) {
        event.stopPropagation();
        let {context, value} = event.detail.data;
        let updatedItem = { Id: context, Rating: value };
        this.updateDraftValues(updatedItem);
    }

    handleCellChange(event) {
        this.updateDraftValues(event.detail.draftValues[0]);
    }

    closeModal() {
        this.showModal = false;
    }
    refreshApex() {
        refreshApex(this.wiredAccontList);
    }
    handleRowAction(event) {
        this.record = event.detail.row.Id;
        this.showModal = true;
    }
    handleSave(event) {
        const recordInputs =  JSON.parse(JSON.stringify(event.detail.draftValues)).slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        recordInputs.map(recordInput => updateRecord(recordInput).then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contact updated',
                    variant: 'success'
                })
            );
            return refreshApex(this.wiredAccontList).then(() => {
                this.draftValues =[];
            }); 
           
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or reloading record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        })
        ); 
    }

    @wire(getListOfAccounts)
    wiredAccount(result) {
    const { data, error } = result;
    this.wiredAccontList = result;
    if (data) {
      this.accounts = data;
      this.lastSavedData = data;
      this.error = undefined;
      console.log(this.accounts)
    } else if (error) {
      this.error = error;
      this.accounts = undefined;
        }
    }

}