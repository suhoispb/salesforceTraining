import { LightningElement, wire, track, api } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columns = [
    { label: 'First Name', fieldName: 'FirstName' },
    { label: 'Last Name', fieldName: 'LastName' },
    { label: 'Account', fieldName: 'accountUrl', type:'url', typeAttributes: {
        label: { fieldName: 'AccountName' },
        target : '_self'
    }},
    { label: 'Mobile Phone', fieldName: 'MobilePhone', type: 'phone' },
    { label: 'Email', fieldName: 'Email', type: 'email' },
    { label: 'Created Date', fieldName: 'CreatedDate', type: 'date', typeAttributes:{
        year:'2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: "2-digit",
        minute: "2-digit" }
    },
    { label: 'Delete', 
    type: 'button-icon',
    fixedWidth: 60,
    typeAttributes: {
        iconName: 'utility:delete',
        name: 'delete_record', 
        title: 'delete',
        variant: 'border-filled',
        alternativeText: 'delete',
    } }
  ];

  
export default class Table extends LightningElement {
    
    key='';
    error;
    columns = columns;
    @track contacts;
    @track showModal = false;
    @track showAddModal = false;
    @track record = {};

    updateKey(event) {
      this.key = event.detail;
  }

    handleRowAction(event) {
        this.record  = event.detail.row.Id;
        this.showModal = true;
    }
    
    addContact(event) {
        this.showAddModal = true;
        event.stopPropagation();
    }
    closeAddContactModal() {
        this.showAddModal = false;
    }
    closeModal() {
        this.showModal = false;
    }

    saveContact() {
        
    }

    @wire(getContactList, { searchKey: '$key'})
    wiredContact({data, error}) {
        if (data) {
            let accountUrl;
            this.contacts = data.map(row => {
                const clone = {...row, AccountName : row.Account.Name}
                accountUrl = `/lightning/r/Account/${clone.AccountId}/view`;
                return {...clone, accountUrl};
            });
            this.error= undefined;
            
        } else if (error) {
            this.error = error;
            this.contacts = undefined;
        }
       
    }

    deleteContact(){
        console.log(this.record);
            deleteRecord(this.record)
                .then( r =>{
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Contact deleted',
                            variant: 'success'
                        })
                    );
                    return refreshApex(this.wiredContact);
            }).catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error deleting record',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
            }); 
                this.showModal = false;
        }
    }




    