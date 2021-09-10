public with sharing class dynamicRowsController {
    @AuraEnabled( cacheable = true )
    public static List< Account > getAccounts() {
        return [ SELECT Id, Name, Rating FROM Account LIMIT 10 ];
       }
}