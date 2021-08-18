import { LightningElement, api, wire } from 'lwc';

class Search extends LightningElement {     
    onClick() {
        this.dispatchEvent(new CustomEvent("cchange", { 
            detail: this.template.querySelector('lightning-input').value 
        }));
      }
};

export default Search;
