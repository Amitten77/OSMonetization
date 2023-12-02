// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// https://solidity-by-example.org/
// Maybe refactor to Rust Later...

contract OSMonetization {
    //Put into Getters instead of leaving as public variables
    mapping(string => uint[]) public user_repos; //user to a list of repositories (id)
    mapping(string => uint) public user_length;
    mapping(uint => Respository) public id_to_repo;
    //mapping(string => uint) public url_to_id; //Github URL to Repository ID
    uint public repo_id = 1;
    string public name;
    /*
    

    Amit 

    Dylan's Function:
    Input: (User Map, Total Days) {
        helper function to get amount of people to give credit to
        Output: Map of people shortlisted and initial percentages
    }


    Jesse's Function:
    Input: List of all usernames, how many people each person should peer review
    Output: Map of each person to a list of people they will peer review

    */

    struct Respository {
        uint repo_id;
        string url;
        uint stage;
        uint num_contributors;
        string[] contributors;
        uint[] percent_stake;
    }

    constructor() public {
        name = "OS Monetization";
    }

    /*
    Percent represented as a 5 digit number:
    78962 -> 78.962%
    */
    //NOTE: MASSIVE SECURITY RISK CUZ ITS PUBLIC
    // function registerUser(string memory _username) public {
    //     require(bytes(_username).length > 0);
    //     require(github_to_address[_username] == address(0));
    //     require(bytes(address_to_github[msg.sender]).length == 0);

    //     github_to_address[_username] = msg.sender;
    //     address_to_github[msg.sender] = _username;
    // }
    function getName() public view returns (string memory) {
        return name;
    }

    function setName(string memory _name) public {
        name = _name;
    }

    function getRepoId() public view returns (uint) {
        return repo_id;
    }


    function getRepoContributor(uint _repo_id, uint index) public view returns (string memory) {
        return id_to_repo[_repo_id].contributors[index];

    }

    function getRepoPercent(uint _repo_id, uint index) public view returns (uint) {
        return id_to_repo[_repo_id].percent_stake[index];

    }

    function getUserReposLength(string memory username) public view returns (uint) {
        return user_repos[username].length;
    }

    function getUserRepo(string memory username, uint index) public view returns (Respository memory) {
        uint post_index = user_repos[username][index];
        return id_to_repo[post_index];
    }

    function createRepo(
        string memory _repositoryURL,
        string[] memory _names,
        uint[] memory _commits,
        uint[] memory _lines,
        uint[] memory _workdays,
        uint _totalDays
    ) public {
        //require(bytes(address_to_github[msg.sender]).length != 0);
        //require(url_to_id[_repositoryURL] == 0);
        require(_names.length == _commits.length);
        require(_lines.length == _commits.length);
        require(_lines.length == _workdays.length);

        uint[] memory _percents = calcWeightedCredit(_names, _commits, _lines, _workdays, _totalDays);

        Respository memory repo = Respository(
            repo_id,
            _repositoryURL,
            1,
            _names.length,
            _names,
            _percents
        );
        id_to_repo[repo_id] = repo;
        //url_to_id[_repositoryURL] = repo_id;
        for (uint i = 0; i < _names.length; i++) {
            user_repos[_names[i]].push(repo_id);
        }
        repo_id += 1;
    }

    ///////////////////
    /* DYLAN'S WORK */
    //////////////////

    uint[] public _weighted;
    event Credit(uint[] credit);

    function calcWeightedCredit(
        string[] memory names,
        uint[] memory commits,
        uint[] memory lines,
        uint[] memory workdays,
        uint totalDays
    ) public returns (uint[] memory) {
        //Calculates total lines and total commits from all developers
        uint totalLines = 0;
        uint totalCommits = 0;
        for (uint i = 0; i < names.length; i += 1) {
            totalLines += lines[i];
            totalCommits += commits[i];
        }

        //Calculates weighted values for each developer
        for (uint i = 0; i < _weighted.length; i += 1) {
            _weighted.pop();
        }
        for (uint i = 0; i < _weighted.length; i += 1) {
            _weighted[i] = 0;
        }
        for (uint i = 0; i < _weighted.length; i += 1) {
            _weighted.pop();
        }
        for (uint i = 0; i < _weighted.length; i += 1) {
            _weighted.pop();
        }

        uint[] storage weighted = _weighted;

        for (uint i = 0; i < names.length; i += 1) {
            uint currCommits = commits[i];
            uint currLines = lines[i];
            uint currDays = workdays[i];

            uint proportionOfDays = ((currDays * 100) / totalDays) + 100;
            uint proportionOfCommits = ((currCommits * 100) / totalCommits) +
                100;
            uint proportionOfLines = ((currLines * 100) / totalLines) + 100;

            uint weightedVal = ((proportionOfDays ** 2 / 100) *
                (proportionOfCommits ** 3 / 10000) *
                (proportionOfLines ** 3 / 10000)) / 10000;

            weighted.push(weightedVal);
        }

        //Calculates proportion for each developer
        uint totalVal = 0;
        for (uint i = 0; i < weighted.length; i += 1) {
            totalVal += weighted[i];
        }
        for (uint i = 0; i < weighted.length; i += 1) {
            weighted[i] = (weighted[i] * 100000) / totalVal;
        }

        //Finds the developer with the highest contributions and adds extra percentage to their share
        uint totalPortion = 0;
        uint maxIndex = 0;
        uint max = weighted[0];
        for (uint i = 0; i < weighted.length; i += 1) {
            totalPortion += weighted[i];
            if (max < weighted[i]) {
                max = weighted[i];
                maxIndex = i;
            }
        }
        weighted[maxIndex] += (100000 - totalPortion);

        //Ouputs the percentages in an unsorted order
        uint[] storage value = weighted;
        emit Credit(value);
        return value;
    }

    // /////////////////////////////////////////////////////////
    // /////////////////////////////////////////////////////////
    // /////////////////////////////////////////////////////////

    function Shuffle(uint n) public view returns (uint[] memory) {
        uint[] memory arr = new uint[](n);

        for (uint a = 0; a < n; a++) {
            arr[a] = a + 1;
        }

        for (uint a = 0; a < n; a++) {
            //uint swap = randInt(a, n - 1);
            uint swap = (uint(blockhash(block.number - a - 1)) % (n - a)) + a;
            uint temp = arr[a];
            arr[a] = arr[swap];
            arr[swap] = temp;
        }

        return arr;
    }

    function Shuffle(
        uint[] memory arr,
        uint n
    ) public view returns (uint[] memory) {
        for (uint a = 0; a < n; a++) {
            //uint swap = randInt(a, n - 1);
            uint swap = (uint(blockhash(block.number - a - 1)) % (n - a)) + a;
            uint temp = arr[a];
            arr[a] = arr[swap];
            arr[swap] = temp;
        }
        return arr;
    }

    event Create2DArray(uint[][] result);

    function CreateArr(uint n, uint edit) public returns (uint[][] memory) {
        require(n > edit, "Number of peer edits per person is too high");
        uint[] memory arr = Shuffle(n);
        uint[][] memory result = new uint[][](n);
        for (uint a = 0; a < n; a++) {
            uint[] memory temp = new uint[](edit);
            for (uint b = 0; b < edit; b++) {
                temp[b] = arr[(a + b + 1) % n];
                //temp = Shuffle(temp, edit);
            }

            result[a] = temp;
        }
        emit Create2DArray(result);
        return result;
    }

    mapping(string=> int256[]) public userDecisions; 

    // Function to create the map
    function initMap(string[] memory usernames) public {
        // Iterate through each string in the array
        for (uint i = 0; i < usernames.length; i++) {
            int[] memory newarr = new int256[](usernames.length);
            for (uint j = 0; j < newarr.length; j++) {
                newarr[j] = -1;
            }
            userDecisions[usernames[i]] = newarr;
        }
    }


    function voteDecision(string memory _username, uint256 index, int8 decision) public {
        require(index < userDecisions[_username].length, "Index out of bounds");
        require (index >= 0, "Index out of bounds");
        require(decision == 0 || decision == 1, "Invalid decision");

        // Set the decision at the specified index
        userDecisions[_username][index] = decision;
    }

    // Function to determine if a username should be verified
    function shouldVerify(string memory _username) external view returns (bool) { 
        uint256 numDecisions = 0; 
        uint256 approves = 0; 
        uint256 disproves = 0; 
        for (uint256 i = 0; i < userDecisions[_username].length; i++) {
            if (userDecisions[_username][i] != -1) {
                numDecisions++;
            } else if (userDecisions[_username][i] == 1) {
                approves++;
            } else {
                disproves++; 
            }
        }
        require(numDecisions > 0, "No one has voted for this user yet");

        return (approves > disproves);
    }
    


    struct Case{
        uint id;
        address maker;
        address target;
        bool more; //False means deserves less
        uint net;
        uint votes;
    }
    Case[] AllCases;
    function NewCase(address target, bool more) public{
        AllCases.push(Case(AllCases.length, msg.sender, target, more, 0, 0));
    }


    //Stage 3
    mapping(address => bool[]) public _voted;

    function CreateMap(address[] memory ads, int numofcases) public {
        for (uint a = 0; a < ads.length; a++) {
            bool[] memory cases = new bool[](uint(numofcases));
            for (int b = 0; b < numofcases; b++) {
                cases[uint(b)] = false;
            }
            _voted[ads[a]] = cases;
        }
    }
    function YesVote(uint id) public{
        /*
        if(msg.sender == AllCases[id].maker  msg.sender == AllCases[id].target){
            //Tell them they can't vote on their own cases
            return;
        }
        if(voted[msg.sender][id]){
            //Tell them they already voted on this case
            return;
        }
        /
        voted[msg.sender][id] = true;
        AllCases[id].votes++;
        AllCases[id].net++;
    }
    function NoVote(uint id) public{
        /
        if(msg.sender == AllCases[id].maker  msg.sender == AllCases[id].target){
            //Tell them they can't vote on their own cases
            return;
        }
        if(voted[msg.sender][id]){
            //Tell them they already voted on this case
            return;
        }
        */
        _voted[msg.sender][id] = true;
        AllCases[id].votes++;
        AllCases[id].net--;
    }
    function NoVote(uint id) public{
        /*
        if(msg.sender == AllCases[id].maker  msg.sender == AllCases[id].target){
            //Tell them they can't vote on their own cases
            return;
        }
        if(voted[msg.sender][id]){
            //Tell them they already voted on this case
            return;
        }
        */
        _voted[msg.sender][id] = true;
        AllCases[id].votes++;
        AllCases[id].net--;
    }
    Case[] YesCases;
    Case[] NoCases;
    function Fill() public{
        for(uint a=0; a<AllCases.length; a++){
            if(AllCases[a].net > 0){
                if(AllCases[a].more){
                    YesCases.push(AllCases[a]);
                }
                else{
                    NoCases.push(AllCases[a]);
                }
            }
        }
    }












}