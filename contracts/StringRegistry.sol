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
        for (uint i = index; i < strings.length-1; i++) {
            strings[i] = strings[i + 1];
        }
        strings.pop();
    }

    // Function to retrieve all strings in the registry
    function getStrings() public view returns (string[] memory) {
        return strings;
    }

    function hashFile(string memory filePath) public {
        fileHashes.push(sha256(abi.encodePacked(filePath)));
    }

    function getFileHashes() public view returns (bytes32[] memory) {
        return fileHashes;
    }

    function isHashPresent(string memory filePath) public view returns (bool) {
        bytes32 fileHash = sha256(abi.encodePacked(filePath));
        for (uint i = 0; i < fileHashes.length; i++) {
            if (fileHashes[i] == fileHash) {
                return true;
            }
        }
        return false;
    }
}