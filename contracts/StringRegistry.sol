// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StringRegistry {
    string[] private strings;
    bytes32[] private fileHashes;

    // Function to add a string to the registry
    function addString(string memory newString) public {
        strings.push(newString);
    }

    function removeString(uint index) public {
        require(index < strings.length && index >= 0, "Index hors limites");
        strings[index] = strings[strings.length - 1];
        strings.pop();
    }

    // Function to retrieve all strings in the registry
    function getStrings() public view returns (string[] memory) {
        return strings;
    }

    function hashFile(string memory filePath) public {
        fileHashes.push(sha256(abi.encodePacked(filePath)));
    }
}