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

    @track draftValues=[];

    lastSavedData=[];

    editing = true;


    updateDataValues(updateItem) {
        let copyData = JSON.parse(JSON.stringify(this.accounts));
        copyData.forEach((item) => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
            }
        });
        this.accounts = [...copyData];
        console.log('updated acc:', this.accounts)
    }

    updateDraftValues(updateItem) {
        let draftValueChanged = false;
        let copyDraftValues = [...this.draftValues];

        copyDraftValues.forEach(item => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
                draftValueChanged = true;
            }       
            console.log('copyDraft after ForEach:', copyDraftValues)      
        });
        if (draftValueChanged) {
            this.draftValues = [...copyDraftValues];
            console.log('if draftValueChanged=true:', this.draftValues)
            
        } else {
            this.draftValues = [...copyDraftValues, updateItem];
            console.log('if draftValueChanged=false:', this.draftValues)
        }
    }

    picklistChanged(event) {
        event.stopPropagation();
        let {context, value} = event.detail.data;
        let updatedItem = { Id: context, Rating: value };
        if(updatedItem) {
            this.editing = false;
        } else {
            this.editing = true;
        }
        console.log('updatedItem:', updatedItem)
        this.updateDraftValues(updatedItem);    
        this.updateDataValues(updatedItem);
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
        console.log('event detail drafts:', event.detail.draftValues)
        const recordInputs =  JSON.parse(JSON.stringify(event.detail.draftValues)).slice().map(draft => {
            const fields = Object.assign({}, draft);
            console.log('fields:', fields)
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

    handleCancel(event) {
        console.log('cancel draftValues:', this.draftValues)
        console.log('accounts:', this.accounts);
        event.preventDefault();
        this.accounts = JSON.parse(JSON.stringify(this.lastSavedData));
        this.draftValues = [];
        console.log('drafts',this.draftValues)
    }

    @wire(getListOfAccounts)
    wiredAccount(result) {
    const { data, error } = result;
    this.wiredAccontList = result;
    if (data) {
      this.accounts = data;
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.accounts = undefined;
        }
    this.lastSavedData = this.accounts; 
    }

}