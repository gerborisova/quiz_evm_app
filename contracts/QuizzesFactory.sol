// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import './Quizzes.sol';

contract ByteCodeGenerator {
    function getBytecode(string calldata _question, string calldata _answer, string calldata _salt) external pure returns(bytes memory){
        bytes memory bytecode= type(Quizzes).creationCode;
        return abi.encodePacked(bytecode, abi.encode(_question,abi.encodePacked(_answer,_salt),_salt));
    }
}

contract QuizFactory{
    event Deploy(address);
    function deploy(bytes memory _code) external payable returns(address addr) {
        assembly {
        addr := create(callvalue(), add(_code,0x20), mload(_code))
        }
    require(addr != address(0),"Deployment failed");
    emit Deploy(addr);
    }
}
