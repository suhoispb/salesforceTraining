import { LightningElement, track, wire } from 'lwc';
import getContactsList from "@salesforce/apex/contactsContoller.getContactsList";


const columns = [
    { label: "Name", fieldName: "nameUrl", type: "url", typeAttributes: {
        label: { fieldName: "Name" },
        target: "_self"
      }
    },
    { label: "idName", fieldName: "IdName" ,  editable: false}
  ];
export default class ContactsTable extends LightningElement {
    
    columns = columns;
    @track contacts;

    @wire(getContactsList)
    wiredContact(result) {
    const { data, error } = result;
    if (data) {
      this.contacts = data.map((row) => {
        return {
          ...row,
          IdName:row.Id + row.Name,
          nameUrl: `/lightning/r/Contact/${row.Id}/view`
        };
      });
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.contacts = undefined;
    }
  }
}
