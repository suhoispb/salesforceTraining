public with sharing class ContactController {

  @AuraEnabled(cacheable=true)
  public static List<Contact> getContactList(string searchKey) {
    searchKey = '%'+ searchKey +'%';
    List<Contact> conList=new List<Contact>();
    conList=[SELECT Id,FirstName, AccountId, LastName, Account.Name, MobilePhone, Email, CreatedDate
            FROM Contact WHERE FirstName LIKE: searchKey  LIMIT 10
            ];
      return conList;
  }
}

