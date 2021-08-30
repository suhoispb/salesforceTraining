import { LightningElement } from "lwc";

class Search extends LightningElement {
  onClick() {
    this.dispatchEvent(
      new CustomEvent("cchange", {
        detail: this.template.querySelector("lightning-input").value
      })
    );
  }
  addContact() {
    this.dispatchEvent(new CustomEvent("addcontact"));
  }
}

export default Search;
