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

    /////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////

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
}
