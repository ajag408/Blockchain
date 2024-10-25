// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

/////////////////// ☆☆ extropyio ☆☆ /////////////////////
//     -漫~*'¨¯¨'*·舞~ solidity ctf ~舞·*'¨¯¨'*~漫-     //
/////////////////////////////////////////////////////////

//deployed to 0x14B5b94439E09f0146FdADB8F4ee325e35e6b9d2 on sepolia

interface Isolution1 {
    function solution(
        uint256[2][3] calldata x, 
        uint256[2][3] calldata y
    ) external pure returns (
        uint256[2][3] memory
    );
}


contract Level1 is Isolution1 {
    function solution(
        uint256[2][3] calldata x,
        uint256[2][3] calldata y
    ) external pure override returns (uint256[2][3] memory) {
        uint256[2][3] memory result;

        for (uint256 i = 0; i < 3; i++) {
            for (uint256 j = 0; j < 2; j++) {
                result[i][j] = x[i][j] + y[i][j];
            }
        }

        return result;
    }
}