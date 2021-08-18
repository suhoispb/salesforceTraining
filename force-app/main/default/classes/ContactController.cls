public with sharing class ContactController {

  @AuraEnabled(cacheable=true)
  public static List<Contact> getContactList(string searchKey) {
    List<Contact> conList=new List<Contact>();
    conList=[SELECT Id,FirstName, 
                    AccountId,
                    LastName, 
                    Account.Name, 
                    MobilePhone, 
                    Email,
                    CreatedDate
            FROM Contact 
            WHERE FirstName LIKE: '%'+ searchKey +'%'
            AND MobilePhone != null
            LIMIT 10
            ];
      return conList;
  }
}



//   @AuraEnabled
//   public static List<Case> fetchCases(){
//       return [SELECT Id, CaseNumber, Subject, Description, AccountId, Account.Name, ContactId,
//       Contact.Name, Status, Priority 
//       FROM CASE
//       LIMIT 10];
//   }
// }