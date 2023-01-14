// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract FieldResearchDef {
    enum FieldResearch { PHYSICS_AND_CHEMISTRY, HUMANITIES, ENGINEERING, EDUCATION,
     ECONOMICS, MATH_AND_COMPUTING, BIOLOGY, MEDICAL }
}

contract ManuscriptFactory is FieldResearchDef {

    address payable[] public manuscripts;

    function submitManuscript(address editor, string memory doccid, string memory title, string memory description, string[] memory tags, FieldResearch field) public {
        address newManuscript = address(new Manuscript(msg.sender, editor, doccid, title, description, tags, field));
        manuscripts.push(payable(newManuscript));
    }

    function getManuscripts() public view returns (address payable[] memory) {
        return manuscripts;
    }
}

contract Manuscript is FieldResearchDef {

    address public author;
    address public editor;
    address payable[] public reviewersList;
    mapping(address => bool) public reviewers;
    string public doccid;
    string public title;
    string public description;
    string[] public tags;

    FieldResearch public field;
    
    struct Review {
        address reviewer;
        string doccid;
    }

    Review[] public reviews;

    constructor(address authorp, address editorp, string memory doccidp, string memory titlep, string memory descriptionp, string[] memory tagsp, FieldResearch fieldp) public {
        author = authorp;
        editor = editorp;
        doccid = doccidp;
        title = titlep;
        description = descriptionp;
        tags = tagsp;
        field = fieldp;
    }

    function submitReview(string memory doccidp) public {

        require(reviewers[msg.sender]);

        Review storage newReview = reviews.push();
        newReview.reviewer = msg.sender;
        newReview.doccid = doccidp;
    }

    function assignReviewer(address reviewerp) public {
        require(msg.sender == editor);
        if(!reviewers[reviewerp]) {
            reviewers[reviewerp] = true;
            reviewersList.push(payable(reviewerp));
        }
    }

    function getReviews() public view returns (Review[] memory) {
        return reviews;
    }

    function getSummary() public view returns (string memory, address, address, string memory, string memory, string[] memory, FieldResearch) {
        return (
            title,
            author,
            editor,
            doccid,
            description,
            tags,
            field
        );
    }

    function getReviewsCount() public view returns (uint) {
        return reviews.length;
    }

    function getReviewersList() public view returns (address payable[] memory) {
        return reviewersList;
    }

}