public with sharing class accountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getListOfAccounts() {
    List<Account> accList=new List<Account>();
    accList=[ SELECT Id, Name, Rating FROM Account LIMIT 10 ];
      return accList;
  }
}