import { LightningElement, wire, track } from "lwc";
import getContactList from "@salesforce/apex/ContactController.getContactList";
import { refreshApex } from "@salesforce/apex";

const columns = [
  { label: "First Name", fieldName: "FirstName" },
  { label: "Last Name", fieldName: "LastName" },
  { label: "Account", fieldName: "accountUrl", type: "url", typeAttributes: {
      label: { fieldName: "AccountName" },
      target: "_self"
    }
  },
  { label: "Mobile Phone", fieldName: "MobilePhone", type: "phone" },
  { label: "Email", fieldName: "Email", type: "email" },
  { label: "Created Date", fieldName: "CreatedDate", type: "date", typeAttributes: {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
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

export default class Table extends LightningElement {
  key = "";
  error;
  columns = columns;
  @track contacts;

  @track record = {};
  @track wiredContactList = [];
  @track showModal = false;
  @track showAddModal = false;

  updateKey(event) {
    this.key = event.detail;
  }
  handleRowAction(event) {
    this.record = event.detail.row.Id;
    this.showModal = true;
  }
  addContact() {
    this.showAddModal = true;
  }
  closeAddContactModal() {
    this.showAddModal = false;
  }
  closeModal() {
    this.showModal = false;
  }
  refreshApex() {
    refreshApex(this.wiredContactList);
  }
  @wire(getContactList, { searchKey: "$key" })
  wiredContact(result) {
    const { data, error } = result;
    this.wiredContactList = result;
    if (data) {
      this.contacts = data.map((row) => {
        return {
          ...row,
          accountUrl: `/lightning/r/Account/${row.AccountId}/view`,
          AccountName: row.Account.Name
        };
      });
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.contacts = undefined;
    }
  }
}
