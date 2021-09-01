import { LightningElement, api } from "lwc";
import { createRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class AddContactWindow extends LightningElement {
  @api showAddModal;

  closeAddContactModal() {
    this.dispatchEvent(new CustomEvent("closeaddcontactmodal"));
  }
  saveContact() {
    let fields = {
      FirstName: this.template.querySelector(".fNameInput").value,
      MobilePhone: this.template.querySelector(".phoneInput").value,
      LastName: this.template.querySelector(".lNameInput").value,
      Email: this.template.querySelector(".emailInput").value,
      AccountId: this.template.querySelector(".accountInput").value
    };

    let objRecordInput = { apiName: "Contact", fields };
    createRecord(objRecordInput)
      .then((con) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "Contact created",
            variant: "success"
          })
        );
        this.dispatchEvent(new CustomEvent("refreshapex"));
      })
      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error creating record",
            message: error.body.message,
            variant: "error"
          })
        );
      });
    this.dispatchEvent(new CustomEvent("closeaddcontactmodal"));
  }
}
