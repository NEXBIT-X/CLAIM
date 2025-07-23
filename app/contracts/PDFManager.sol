// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;



// pdf manager smart contract

contract PDFManager {
    string private pdfContent;
    struct PDF {
        address owner;      
        string ipfsCid;   
        string title;      
        bool isPublic;    
        uint256 timestamp; 
    }
     mapping(bytes32 => PDF) public pdfs;
     event PDFAdded(
        bytes32 indexed pdfId,
        address indexed owner,
        string ipfsCid,
        string title,
        bool isPublic,
        uint256 timestamp
    );
     event PDFVisibilityToggled(
        bytes32 indexed pdfId,
        address indexed owner,
        bool newVisibility
    );
    function addPDF(
        string memory _ipfsCid,
        string memory _title,
        bool _makePublic
    ) public {
        
        bytes32 pdfId = keccak256(abi.encodePacked(_ipfsCid));
        require(pdfs[pdfId].owner == address(0), "PDF with this CID already exists");
        pdfs[pdfId] = PDF({
            owner: msg.sender,
            ipfsCid: _ipfsCid,
            title: _title,
            isPublic: _makePublic,
            timestamp: block.timestamp
        });
        emit PDFAdded(
            pdfId,
            msg.sender,
            _ipfsCid,
            _title,
            _makePublic,
            block.timestamp
        );
    }
    function togglePDFVisibility(string memory _ipfsCid) public {
        bytes32 pdfId = keccak256(abi.encodePacked(_ipfsCid));
        // Retrieve the PDF details
        PDF storage pdf = pdfs[pdfId];

        // Ensure the PDF exists
        require(pdf.owner != address(0), "PDF does not exist");

        // Ensure only the owner can toggle visibility
        require(pdf.owner == msg.sender, "Only owner can toggle visibility");

        // Toggle the public status
        pdf.isPublic = !pdf.isPublic;

        // Emit an event
        emit PDFVisibilityToggled(pdfId, msg.sender, pdf.isPublic);
    }
    
     function getPDFDetails(
        string memory _ipfsCid
    )
        public
        view
        returns (
            address owner,
            string memory ipfsCid,
            string memory title,
            bool isPublic,
            uint256 timestamp
        )
    {
        bytes32 pdfId = keccak256(abi.encodePacked(_ipfsCid));
        PDF storage pdf = pdfs[pdfId];

        // Ensure the PDF exists
        require(pdf.owner != address(0), "PDF does not exist");

        // Check if it's public or if the caller is the owner
        require(
            pdf.isPublic || pdf.owner == msg.sender,
            "PDF is private and you are not the owner"
        );

        return (
            pdf.owner,
            pdf.ipfsCid,
            pdf.title,
            pdf.isPublic,
            pdf.timestamp
        );
    }
}

