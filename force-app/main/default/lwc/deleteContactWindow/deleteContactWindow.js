import { LightningElement, api } from "lwc";
import { deleteRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class DeleteContactWindow extends LightningElement {
  @api showModal;
  @api record;
  closeModal() {
    this.dispatchEvent(new CustomEvent("closemodal"));
  }
  deleteContact() {
    deleteRecord(this.record)
      .then((r) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "Contact deleted",
            variant: "success"
          })
        );
        this.dispatchEvent(new CustomEvent("refreshapex"));
      })
      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error deleting record",
            message: error.body.message,
            variant: "error"
          })
        );
      });
    this.dispatchEvent(new CustomEvent("closemodal"));
  }
}
