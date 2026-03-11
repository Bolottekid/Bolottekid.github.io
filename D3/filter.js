function Typefilter(This) {
  var statfilter = document.getElementById("stat1");
  statfilter.innerHTML = "<option>Filter</option>"
  var TMPL = This.value;
  var i = 0;
  var newoption
  if (TMPL == "Player") {
    d3.csv("PLlist.dat").then(function(box) {
      box.forEach(function(d) {
        //console.log(d.PLAYER);
        newoption = document.createElement('option');
        newoption.value = d.PLAYER;
        newoption.textContent = d.PLAYER;
        statfilter.append(newoption);
        i += 1;
      });
      newoption = document.createElement('option');
      newoption.value = i;
      newoption.textContent = "All";
      statfilter.append(newoption);
    });
  } else if ((TMPL == "Team")||(TMPL == "TeamVS")) {
    d3.csv("TMlist.dat").then(function(box) {
      box.forEach(function(d) {
        //console.log(d.PLAYER);
        newoption = document.createElement('option');
        newoption.value = d.CODE;
        newoption.textContent = d.CODE;
        statfilter.append(newoption);
        i += 1;
      });
      newoption = document.createElement('option');
      newoption.value = i;
      newoption.textContent = "All";
      statfilter.append(newoption);
    });
  };
}
