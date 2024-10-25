// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

/////////////////// ☆☆ extropyio ☆☆ /////////////////////
//     -漫~*'¨¯¨'*·舞~ solidity ctf ~舞·*'¨¯¨'*~漫-     //
/////////////////////////////////////////////////////////

//deployed to 0x00C7A499483A303E1920CCA1ECD6d72ff966Be41 on sepolia

interface Isolution2 {
  function solution(uint256[10] calldata unsortedArray) external returns (uint256[10] memory sortedArray);
}


contract Level2 is Isolution2 {
    function solution(
        uint256[10] calldata unsortedArray
    ) external pure override returns (uint256[10] memory sortedArray) {
        uint[10] memory sortedArray = unsortedArray;

        for(uint256 i =0; i<9; i++){
            for(uint256 j = 0; j<9-i; j++){
                if(sortedArray[j] > sortedArray[j+1]){
                    (sortedArray[j], sortedArray[j+1]) = (sortedArray[j+1], sortedArray[j]);
                }
            }
        }
        return sortedArray;

    }
}