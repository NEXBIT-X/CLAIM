function Patent(){
    const patents = [
        {
            title: "Patent Title 1",
            description: "Description of Patent 1",
            date: "2023-01-01"
        },
        {
            title: "Patent Title 2",
            description: "Description of Patent 2",
            date: "2023-02-01"
        },
        {
            title: "Patent Title 3",
            description: "Description of Patent 3",
            date: "2023-03-01"
        },
        {
            title: "Patent Title 4",
            description: "Description of Patent 4",
            date: "2023-01-01"
        },
        {
            title: "Patent Title 5",
            description: "Description of Patent 5",
            date: "2023-02-01"
        },
        {
            title: "Patent Title 6",
            description: "Description of Patent 6",
            date: "2023-03-01"
        },        
    ]
    const patt= patents.map((pat, index) => (
        <div className="pat" key={index}>
            <h1>{pat.title}</h1>
            <p>{pat.description}</p>
            <em>{pat.date}</em>
        </div>
      ));
    return(
        <>
         <div className='patent-header'>
            <h1>Patents</h1>
            <p>List of Patents</p>
        </div>
        <div className='patents'>
            {patt}
        </div>
        </>
    );
}

export default Patent;


