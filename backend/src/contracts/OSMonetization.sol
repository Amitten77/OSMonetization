// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// https://solidity-by-example.org/
// Maybe refactor to Rust Later...

contract OSMonetization {
    //Put into Getters instead of leaving as public variables
    mapping(string => uint[]) public user_repos; //user to a list of repositories (id)
    mapping(address => string) public address_to_github; //Relates a metamask address to github username
    mapping(string => address) public github_to_address; //Relates a github username to metamask address
    mapping(uint => uint[]) public stage_to_repo; //(repo id)
    mapping(uint => Respository) public id_to_repo;
    mapping(string => uint) public url_to_id; //Github URL to Repository ID
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
        string repo_name;
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
    function registerUser(string memory _username) public {
        require(bytes(_username).length > 0);
        require(github_to_address[_username] == address(0));
        require(bytes(address_to_github[msg.sender]).length == 0);

        github_to_address[_username] = msg.sender;
        address_to_github[msg.sender] = _username;
    }

    //Problem if user decides to change their repository name or username to something else
    //Decimal represented as five digit number: 78123 -> 78.123%
    function createRepo(
        string memory _repositoryURL,
        string memory _repository,
        string[] memory _users,
        uint[] memory _percents
    ) public {
        require(bytes(address_to_github[msg.sender]).length != 0);
        require(url_to_id[_repositoryURL] == 0);
        require(_users.length == _percents.length);

        Respository memory repo = Respository(
            repo_id,
            _repositoryURL,
            _repository,
            1,
            _users.length,
            _users,
            _percents
        );
        id_to_repo[repo_id] = repo;
        stage_to_repo[1].push(repo_id);
        url_to_id[_repositoryURL] = repo_id;
        for (uint i = 0; i < _users.length; i++) {
            user_repos[_users[i]].push(repo_id);
        }
        repo_id += 1;
    }

    ///////////////////
    /* DYLAN'S WORK */
    //////////////////

    // uint public constant totalMoney = 500;
    uint public constant contributors = 5;
    string[contributors] public finalNames;

    event Credit(uint[] credit);

    function calcWeightedCredit(
        string[] memory names,
        uint[] memory commits,
        uint[] memory lines,
        uint[] memory workdays,
        uint totalDays
    ) public returns (uint[contributors] memory) {
        uint totalLines = 0;
        uint totalCommits = 0;

        uint[contributors] memory weighted;

        for (uint i = 0; i < names.length; i += 1) {
            totalLines += lines[i];
            totalCommits += commits[i];
        }

        for (uint i = 0; i < names.length; i += 1) {
            uint currCommits = commits[i];
            uint currLines = lines[i];
            uint currDays = workdays[i];

            //Math with Uint might be broken
            //Need to troubleshoot this
            uint proportionOfDays = ((currDays * 100) / totalDays) + 100;
            uint proportionOfCommits = ((currCommits * 100) / totalCommits) +
                100;
            uint proportionOfLines = ((currLines * 100) / totalLines) + 100;

            uint weightedVal = ((proportionOfDays ** 2 / 100) *
                (proportionOfCommits ** 3 / 10000) *
                (proportionOfLines ** 3 / 10000)) / 10000;

            weighted[i] = weightedVal;
        }

        uint[contributors] memory value = calcProportion(weighted, names);
        emit Credit(value);
        return value;
    }

    event Credit(uint[contributors] credit);

    function calcProportion(
        uint[contributors] memory weighted,
        string[] memory names
    ) public returns (uint[contributors] memory) {
        uint[contributors] memory outputValues;

        uint totalVal = 0;
        for (uint i = 0; i < weighted.length; i += 1) {
            totalVal += weighted[i];
        }

        for (uint i = 0; i < weighted.length; i += 1) {
            outputValues[i] = ((weighted[i] * 100) / totalVal);
        }

        (
            uint[contributors] memory sortedOutput,
            string[contributors] memory sortedNames
        ) = sort(names, outputValues, names);

        uint[contributors] memory outputProportions;
        string[contributors] memory outputNames;

        for (uint i = 0; i < contributors; i++) {
            outputProportions[i] = sortedOutput[i];
            outputNames[i] = sortedNames[i];
        }

        finalNames = outputNames;

        uint totalCheck = 0;
        for (uint i = 0; i < contributors; i++) {
            totalCheck += outputProportions[i];
        }
        if (totalCheck < 100) {
            outputProportions[0] += (100 - totalCheck);
        }

        uint[contributors] memory value = outputProportions;
        emit Credit(value);
        return value;
    }

    event Credit(string[contributors] credit);

    function getFinalNames() public returns (string[contributors] memory) {
        string[contributors] memory value = finalNames;
        emit Credit(value);
        return value;
    }

    //Sorts the wrong way
    function sort(
        string[] memory names,
        uint[contributors] memory data,
        string[] memory namesInput
    )
        public
        pure
        returns (uint[contributors] memory, string[contributors] memory)
    {
        uint length = data.length;
        for (uint i = 1; i < length; i++) {
            uint key = data[i];
            string memory keyName = names[i];
            int j = int(i) - 1;
            while ((int(j) >= 0) && (data[uint(j)] > key)) {
                data[uint(j + 1)] = data[uint(j)];
                namesInput[uint(j + 1)] = namesInput[uint(j)];
                j--;
            }
            data[uint(j + 1)] = key;
            namesInput[uint(j + 1)] = keyName;
        }

        uint[contributors] memory reversedData;
        string[contributors] memory reversedNamesInput;
        for (uint i = 0; i < contributors; i++) {
            reversedData[i] = data[contributors - 1 - i];
            reversedNamesInput[i] = namesInput[contributors - 1 - i];
        }

        return (reversedData, reversedNamesInput);
    }
}
