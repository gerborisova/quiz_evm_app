// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import './Quizzes.sol';

contract QuizFactory{
    Quizzes[] public quizzes;
    event QuizCreated(Quizzes indexed quiz);

    constructor() payable{}

    function createQuiz(string memory question, string memory answer) public payable{
        Quizzes quiz = new Quizzes(question, abi.encodePacked(answer,"randomSalt"), "randomSalt");
        quizzes.push(quiz); 
        emit QuizCreated(quiz);
    }

    function getCreatedQuizzes() public view returns(Quizzes[] memory) {
        return quizzes;
    }
}


// contract ByteCodeGenerator {
//     function getBytecode(string calldata _question, string calldata _answer, string calldata _salt) external pure returns(bytes memory){
//         bytes memory bytecode= type(Quizzes).creationCode;
//         return abi.encodePacked(bytecode, abi.encode(_question,abi.encodePacked(_answer,_salt),_salt));
//     }
// }