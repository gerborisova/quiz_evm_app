// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";

contract Quizzes{

    string public question;
    bytes private answer; 
    string private salt;
    event GuessAttempt(string guess);
    event CorrectGuess(string guess);
    event SuccessfulyTransfered(address receiver, uint value);
    event TransactionAttempt(address receiver, uint value);
    event NotEnoughBalance();

    constructor(string memory _question, bytes memory  _answer, string memory _salt) payable{
        question=_question;
        salt=_salt;
        answer=_answer; 
    }

    function readQuestion() public view returns(string memory) {
        return question;
    } 

     function sendWei() public payable {
    } 
    function transferFunds() private{
        if(address(this).balance>0){
         (bool success,)= payable(msg.sender).call{value: address(this).balance}("");
         emit TransactionAttempt(msg.sender,address(this).balance);
         require(success, "Transaction failed");
         emit SuccessfulyTransfered(msg.sender,address(this).balance);
        }else{
            emit NotEnoughBalance();
        }
    }

    function guessAnswer(string calldata _guess) external {
        emit GuessAttempt(_guess);
        require(keccak256(abi.encodePacked(_guess,salt))==keccak256(answer),"Wrong answer");
        emit CorrectGuess(_guess);
        transferFunds();
    }

    //helper function for unit tests;
    function getBalance() external view returns(uint){
        return address(this).balance;
    }

    fallback() external payable {
    emit TransactionAttempt(msg.sender,msg.value);
    }
    receive() external payable {
    emit TransactionAttempt(msg.sender,msg.value);
    }

}
