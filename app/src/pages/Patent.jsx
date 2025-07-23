import ReactPDF from '@react-pdf/renderer';


function Patent() {
  const patents = [
    {
      title: "Patent Title 1",
      description: "Description of Patent 1",
      date: "2023-01-01",
      file:"https://example.com/patent1.pdf",
    },
    {
      title: "Patent Title 2",
      description: "Description of Patent 2",
      date: "2023-02-01",
      file:"https://example.com/patent2.pdf",
    },
    {
      title: "Patent Title 3",
      description: "Description of Patent 3",
      date: "2023-03-01",
      file:"https://example.com/patent3.pdf",
    },
    {
      title: "Patent Title 4",
      description: "Description of Patent 4",
      date: "2023-01-01",
      file:"https://example.com/patent4.pdf",
    },
    {
      title: "Patent Title 5",
      description: "Description of Patent 5",
      date: "2023-02-01",
      file:"https://example.com/patent5.pdf",
    },
    {
      title: "Patent Title 6",
      description: "Description of Patent 6",
      date: "2023-03-01",
      file:"https://example.com/patent6.pdf",
    },
    {
      title: "Patent Title 7",
      description: "Description of Patent 7",
      date: "2023-04-01",
      file:"https://example.com/patent7.pdf",
    },
    {
      title: "Patent Title 8",
      description: "Description of Patent 8",
      date: "2023-05-01",
      file:"https://example.com/patent8.pdf",
    },
    {
      title: "Patent Title 9",
      description: "Description of Patent 9",
      date: "2023-06-01",
      file:"https://example.com/patent9.pdf",
    },
    {
      title: "Patent Title 10",
      description: "Description of Patent 10",
      date: "2023-07-01",
      file:"https://example.com/patent10.pdf",
    },
  ];
  const patt = patents.map((pat, index) => (
    <div className="pat" key={index}>
      <h1>{pat.title}</h1>
      <p>{pat.description}</p>
      <em>{pat.date}</em>
    </div>
  ));
  return (
    <>
      <div className="patent-header">
        <h1>Patents</h1>
        <p>List of Patents</p>
      </div>
      <div className="patents">{patt}</div>
    </>
  );
}

export default Patent;
