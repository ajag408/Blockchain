// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

/////////////////// ☆☆ extropyio ☆☆ /////////////////////
//     -漫~*'¨¯¨'*·舞~ solidity ctf ~舞·*'¨¯¨'*~漫-     //
/////////////////////////////////////////////////////////

//deployed to 0x9317ce9c06a8f69ACB3bf47f11ce4026ebD7cB84 on sepolia

    interface Isolution {
        function solution() external pure returns (uint8);
    }


contract Level0 {

	  function solution() external pure returns (uint8){
       return 42;
      }
}