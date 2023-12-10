const url =
  "https://eboardresults.com/v2/list?id=btree&board=mymensingh&exam=hsc&year=2023&type=tbl&cols=eiin,i_code,i_name,zilla,thana&_=1701859764274";

fetch(url)
  .then((res) => res.json())
  .then((d) => {
    console.log(d);
  });
