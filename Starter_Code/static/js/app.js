function buildCharts(sample) {
    // Make an API call to gather all data and then reduce to matching the sample selected
    //TODO: 
    d3.json("samples.json").then((data) => {
      console.log("data retrieved for buildcharts")
      var datafiltered = data.samples.filter(table => table.id == sample)[0]
      console.log(datafiltered)
      // var datatop = datafiltered.slice(0,10)
      var samplevalues = datafiltered.sample_values
      var otuids = datafiltered.otu_ids
      var otulabels = datafiltered.otu_labels
      var trace1 = {
        x: samplevalues,
        y: otuids,
        type: "bar"
      }
      var layout = {
        title: sample,
        xaxis: {title: "bacteria"},
        yaxis: {title: "number of cultures"},
        orientation: "h"
      }
      var plotdata = [trace1]
      Plotly.newPlot("bar", plotdata, layout)

      var trace2 = {
        x: otuids,
        y: samplevalues,
        mode: "markers",
        marker: {
          size: samplevalues,
          color: otuids
        },
        text: otulabels
      }
      var layoutbubble = {
        xaxis:{title: "otu"}
      }
      var bubbledata = [trace2]
      Plotly.newPlot("bubble", bubbledata, layoutbubble)
    })

};

function buildMetadata(sample) {
    // Make an API call to gather all data and then reduce to matching the sample selected
    //TODO: 
    metadiv = d3.select("#sample-metadata")
    metadiv.html("")

    d3.json("samples.json").then((data) => {
      console.log("data retrieved for buildcharts");
      var datafiltered = data.metadata.filter(table => table.id == sample)[0];
      Object.entries(datafiltered).forEach(function([key, value]){
        metadiv.append("p").text(`${key} : ${value}`)
      })
    })
};

function init() {
    console.log("initializing")
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
    console.log(selector)
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      console.log(sampleNames)
      console.log(data.names)
      sampleNames.forEach(sampleid => {
        console.log("1")
        selector.append("option").text(sampleid).property("value", sampleid)
      });
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      console.log(firstSample)
      buildCharts(firstSample);
      buildMetadata(firstSample);

      // Loop through sampleNames to add "option" elements to the selector
      //TODO: 


    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  console.log("prior to init")
  // Initialize the dashboard
  init();