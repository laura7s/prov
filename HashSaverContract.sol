pragma solidity ^0.4.23;

contract Hash {
   
   string[] hashes;
   address owner;
   
   constructor() {
       owner = msg.sender;
   }
   
   modifier onlyOwner() {
       require(msg.sender == owner);
       _;
   }
   
   function addHash(string _newHash) public onlyOwner {
       hashes.push(_newHash);
   }
   
   event isInside(bool isInside);
   
   function compareStrings (string a, string b) pure internal returns (bool){
      return keccak256(a) == keccak256(b);
  }
   
   function checkHash(string hash) public {
       bool isInsideBool = false;
       for(uint i = 0; i < hashes.length; i++) {
           if (compareStrings(hash, hashes[i])) {
               isInsideBool = true;
               break;
           }
       }
       
       emit isInside(isInsideBool);
       
   }
   
}
