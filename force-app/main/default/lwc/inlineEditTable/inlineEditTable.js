import { LightningElement, track, wire } from 'lwc';
import getListOfAccounts from "@salesforce/apex/accountController.getListOfAccounts";
import { refreshApex } from "@salesforce/apex";
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columns = [
    { label: "Name", fieldName: "Name", editable: true},
    {label: 'Rating', fieldName: 'Rating', type: 'picklist', editable: true,  typeAttributes: {
            placeholder: 'Choose rating', options: [
                { label: 'Hot', value: 'Hot' },
                { label: 'Warm', value: 'Warm' },
                { label: 'Cold', value: 'Cold' },
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
    updatedItem;

    picklistChanged(event) {
        event.stopPropagation();
        let dataRecieved = event.detail.data;
        let updatedItem = { Id: dataRecieved.context, Rating: dataRecieved.value };
        return this.draftValues = updatedItem;

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
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.accounts = undefined;
    }
    this.lastSavedData = this.accounts;
  }

}