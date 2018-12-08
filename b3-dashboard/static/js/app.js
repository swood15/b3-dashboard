function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var url = `/metadata/${sample}`;
  d3.json(url).then((response) => {
    console.log(response);
    // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(response).forEach(([key, value]) => {
      var row = panel.append("div");
      row.text(`${key}: ${value}`);
    });
  });
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then((response) => {
    // @TODO: Build a Bubble Chart using the sample data
    var data = [{
      x: response.otu_ids,
      y: response.sample_values,
      mode: 'markers',
      type: 'scatter',
      marker: {
        opacity: 0.6,
        size: response.sample_values,
        sizeref: 2.5,
        color: response.sample_values,
        colorscale: 'RdBu',
        cmin: Math.min(response.sample_values),
        cmax: Math.max(response.sample_values),
        showscale: true,
        colorbar: {
          thickness: 10,
          y: 0.5,
          ypad: 0,
          title: 'Sample Value',
          titleside: 'bottom',
          outlinewidth: 1,
          outlinecolor: 'black',
          tickfont: {
            family: 'Lato',
            size: 14,
            color: 'blacck'
          }
        }
      }
    }];

    var layout = {
      showlegend: false,
    };

    Plotly.newPlot("bubble", data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var data = [{
      labels: response.otu_ids.slice(0,10),
      values: response.sample_values.slice(0,10),
      hovertext: response.otu_labels.slice(0,10),
      type: 'pie'
    }];

    Plotly.newPlot("pie", data);
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
