import { LightningElement, wire, track, api } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';


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
    }
  ];

  

export default class Table extends LightningElement {
    
    key='';
    error;
    columns = columns;
    @track contacts;

    updateKey(event) {
      this.key = event.detail;
  }
  

    @wire(getContactList, { searchKey: '$key'})
    wiredContact({ error, data}) {
        if (data) {
            let accountUrl;
            this.contacts = data.map(row => {
                const clone = {...row, AccountName : row.Account.Name}
                accountUrl = `/lightning/r/Account/${clone.AccountId}/view`;
                return {...row, AccountName : row.Account.Name, accountUrl};
            });
            this.error= undefined;
            
        } else if (error) {
            this.error = error;
            this.contacts = undefined;
        }
       
    }
}