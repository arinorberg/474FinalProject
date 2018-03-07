// layout based on: http://blockbuilder.org/Jverma/076377dd0125b1a508621441752735fc
var margin = {top: 40, right: 50, bottom: 40, left:50};
var width = +1000 - margin.left - margin.right;
var height = +675 - margin.top - margin.bottom;

// for BAC graph
var svg = d3.select('#BACresults')
    .append('svg')
    .attr('width', width/2 + margin.left + margin.right)
    .attr('height', height/2 + margin.top + margin.bottom),
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// for drunkness image
var svg2 = d3.select('#drunknessResults')
    .append('svg')
    .attr('width', width/2)
    .attr('height', height/2);

// for graphing BAC against time
var x = d3.scaleLinear()
    .rangeRound([0, width/2]);
var y = d3.scaleLinear()
    .rangeRound([height/2, 0])
var line = d3.line()
    .x(function(d) { return x(d.hour); })
    .y(function(d) { return y(d.bloodAlcConc); });

// setup
var currentBAC = 0;
var gender;
var gender_options = ["male", "female"];
var drug;
var drug_options = ["None", "Caffeine", "Cannabis", "Cocaine","Opioids", "Amphetamines", "Shrooms", "MDMA", "MAOIs", "Benzodiazepines", "PCP", "SSRIs"]
var BACdata;

document.getElementById('w_value').onchange = function() {
    limitNegatives(this);
}
document.getElementById('time').onchange = function() {
    limitNegatives(this);
}
document.getElementById('percent').onchange = function() {
    limitNegatives(this);
}
document.getElementById('ounces').onchange = function() {
    limitNegatives(this);
}
document.getElementById('num_drinks').onchange = function() {
    limitNegatives(this);
}

// update drug when selection is changed from dropdown
d3.select("#dropdownDrug")
.selectAll("option")
.data(drug_options)
.enter()
.append("option")
.attr("value", function(option) { return option; })
.property("selected", function(d){ return d === drug})
.text(function(option) { return option; });
var dropDown = d3.select("#dropdownDrug");
dropDown.on("change", function() {
  drug = d3.event.target.value;
});

// update gender when selection is changed from dropdown
d3.select("#dropdownGender")
.selectAll("option")
.data(gender_options)
.enter()
.append("option")
.attr("value", function(option) { return option; })
.property("selected", function(d){ return d === gender})
.text(function(option) { return option; });
var dropDown = d3.select("#dropdownGender");
dropDown.on("change", function() {
  gender = d3.event.target.value;
});

// alcohol content calculator
function alcoholContent(num, ounces, percentage) {
    var alc = num * ounces * (percentage * .01);
    return alc;
}

// BAC calculator
function BACcalculator(W, G, A, H) {
 var r;
 if (G === 'female') {
   r = .66;
 }
 else {
   r = .73;
 }
 // formula for blood alcohol content
 var BAC = ((A * 5.14 )/ (W * r) - (0.015 * H));
 return BAC;
 }

 // BAC effects based on: http://www.brad21.org/effects_at_specific_bac.html
 function currentEffects(currentBAC) {
   var effects;
   var hangover;
   if (currentBAC < .02) {
     effects = "no significant effects"
   } else if (currentBAC < .03){
       effects = "No loss of coordination, slight euphoria and loss of shyness. Depressant effects are not apparent. Mildly relaxed and maybe a little lightheaded.";
       hangover = "Tomorrow: hangover free. Almost zero chance of a hangover; should be able to get plenty done tomorrow.";
   } else if (currentBAC < .06){
         effects = "Feeling of well-being, relaxation, lower inhibitions, sensation of warmth. Euphoria. Some minor impairment of reasoning and memory, lowering of caution. Your behavior may become exaggerated and emotions intensified (good emotions are better, bad emotions are worse)";
         hangover = "Tomorrow: no hangover ~0% chance of a hangover if you’ve been hydrating between drinks; should be able to get plenty done.";

   } else if (currentBAC < .09){
       effects = "Slight impairment of balance, speech, vision, reaction time, and hearing. Euphoria. Judgment and self-control are reduced, and caution, reason and memory are impaired, .08 is legally impaired and it is illegal to drive at this level. You will probably believe that you are functioning better than you really are.";
       hangover = "Tomorrow: hangover possible Some chance of a hangover; hydrating between drinks will help. Likely a little slow getting things done in the AM.";
   } else if (currentBAC < .125){
       effects = "Significant impairment of motor coordination and loss of good judgment. Speech may be slurred; balance, vision, reaction time and hearing will be impaired. Euphoria.";
       hangover = "Tomorrow: hangover likely. Decreased REM sleep overnight = a bit tired and less productive. Hydration between drinks (not right before bed) will help.";
   } else if (currentBAC < .15){
       effects = "Gross motor impairment and lack of physical control. Blurred vision and major loss of balance. Euphoria is reduced and dysphoria (anxiety, restlessness) is beginning to appear. Judgment and perception are severely impaired.";
       hangover = "Tomorrow: hangover likely. Decreased REM sleep overnight = a bit tired and less productive. Hydration between drinks (not right before bed) will help.";
   } else if (currentBAC < .19){
       effects = "Dysphoria predominates, nausea may appear. The drinker has the appearance of a \"sloppy drunk.\"";
       hangover = "Tomorrow: serious hangover. Probably sick and headachy. No REM sleep at all = not very sharp; studying will be a struggle. Hydration between drinks (not right before bed) will help";
   } else if (currentBAC < .20){
       effects = "Feeling dazed, confused or otherwise disoriented. May need help to stand or walk. If you injure yourself you may not feel the pain. Some people experience nausea and vomiting at this level. The gag reflex is impaired and you can choke if you do vomit. Blackouts are likely at this level so you may not remember what has happened.";
       hangover = "Tomorrow: serious hangover. Probably sick and headachy. No REM sleep at all = not very sharp; studying will be a struggle. Hydration between drinks (not right before bed) will help";
   } else if (currentBAC < .25){
       effects = "All mental, physical and sensory functions are severely impaired. Increased risk of asphyxiation from choking on vomit and of seriously injuring yourself by falls or other accidents.";
       hangover = "Tomorrow: hangover agony. Debilitating headache/nausea and fervent regret almost certain. Productivity of any sort unlikely until mid-afternoon.";
   } else if (currentBAC < .30){
       effects = "STUPOR. You have little comprehension of where you are. You may pass out suddenly and be difficult to awaken.";
       hangover = "Tomorrow: hangover agony. Debilitating headache/nausea and fervent regret almost certain. Productivity of any sort unlikely until mid-afternoon.";
   } else if (currentBAC < .40){
       effects = "Coma is possible. This is the level of surgical anesthesia.";
       hangover = "Tomorrow: bigger problems. A debilitating hangover is only the start. Details will depend on time of hospital release.";
  } else if (currentBAC > .40){
      effects = "Onset of coma, and possible death due to respiratory arrest.";
      hangover = "Tomorrow: hopefully. In the event of survival, hangover or not will depend on the amount and type of anesthesia administered in the hospital.";
   } else {
     effects = "no effects"
     hangover = "no chance of hangover"
   }
  return {"effects": effects, "hangover": hangover};
}

// drug combo based on : https://www.refinery29.com/drug-interactions-chart, http://wiki.tripsit.me/wiki/Drug_combinations#Specific_combinations_with_references_.28work_in_progress.29
function drugCombo(drug) {
  var combo;
  if (drug == "Shrooms") {
    combo = "lower risk and no synergy"
  } else if (drug == "Cannabis") {
    combo = "lower risk and synergy"
  } else if (drug == "MDMA") {
    combo = "Caution"
  } else if (drug == "MAOIs") {
    combo = "UNSAFE"
  } else if (drug == "Cocaine") {
    combo = "UNSAFE"
  } else if (drug == "Amphetamines") {
    combo = "Caution"
  } else if (drug == "SSRIs") {
    combo = "Caution"
  } else if (drug == "Caffeine") {
    combo = "safe and no synergy"
  } else if (drug == "Benzodiazepines") {
    combo = "DEADLY"
  } else if (drug == "Opioids") {
    combo = "DEADLY"
  } else if (drug == "PCP") {
    combo = "DEADLY"
  } else {
    combo = "no drugs use"
  }
  return combo;
}

// function to update all result outputs
function updateOutput(gender, weight, time, percent, ounces, num_drinks, drug) {
  alcohol = alcoholContent(num_drinks, ounces, percent);
  currentBAC = BACcalculator(weight, gender, alcohol, time);
  if (currentBAC < 0) {
    currentBAC = 0;
  }
  console.log(currentBAC);
  effhang = currentEffects(currentBAC);
  console.log("effhang" + effhang.hangover)
  console.log("current effects: " + effhang.effects);
  console.log("hangover: " + effhang.hangover);
  var combo = drugCombo(drug);
  console.log("current drug combo effects: " + combo);

  // print current BAC
  document.getElementById("currBAC").innerHTML = currentBAC;
  // print current effects
  document.getElementById("currEffects").innerHTML = effhang.effects;
  // print hangover effects
  document.getElementById("hangover").innerHTML = effhang.hangover;
  // print current drug effects
  document.getElementById("currDrugEffects").innerHTML = combo;

  // update the BAC graph
  updateGraph(currentBAC, time);

  // figure out drunk blurriness
  if (currentBAC < .02) {
    defs.append("filter")
      .attr("id", "motionFilter")
      .attr("width", "300%")		//Increase the width of the filter region to remove blur "boundary"
      .attr("x", "-100%") 			//Make sure the center of the "width" lies in the middle of the element
      .append("feGaussianBlur")	//Append a filter technique
      .attr("class", "blurValues")	//Needed to select later on
      .attr("in", "SourceGraphic")	//Perform the blur on the applied element
      .attr("stdDeviation", "0 0");	//Do a blur of 0 standard deviations in the horizontal and vertical direction
  } else if (currentBAC < .05){
    defs.append("filter")
      .attr("id", "motionFilter")
      .attr("width", "300%")
      .attr("x", "-100%")
      .append("feGaussianBlur")
      .attr("class", "blurValues")
      .attr("in", "SourceGraphic")
      .attr("stdDeviation", "2 0");
  } else if (currentBAC < .1){
      defs.append("filter")
      .attr("id", "motionFilter")
      .attr("width", "300%")
      .attr("x", "-100%")
      .append("feGaussianBlur")
      .attr("class", "blurValues")
      .attr("in", "SourceGraphic")
    	.attr("stdDeviation", "4 0");
  } else if (currentBAC < .15){
    defs.append("filter")
    .attr("id", "motionFilter")
    .attr("width", "300%")
    .attr("x", "-100%")
    .append("feGaussianBlur")
    .attr("class", "blurValues")
    .attr("in", "SourceGraphic")
    .attr("stdDeviation", "6 0");
  } else {
    defs.append("filter")
    .attr("id", "motionFilter")
    .attr("width", "300%")
    .attr("x", "-100%")
    .append("feGaussianBlur")
    .attr("class", "blurValues")
    .attr("in", "SourceGraphic")
    .attr("stdDeviation", "8 0");
  }
  //Apply the blur filter to the drunk circle element
  barImage.transition().style("filter", "url(#motionFilter)").delay(250).duration(12000);
};

// update results when submit button is clicked
document.getElementById('d_submit').onclick = function(){
  new_gender = document.getElementById('dropdownGender').value;
  new_weight = document.getElementById('w_value').value;
  new_time = document.getElementById('time').value;
  new_percent = document.getElementById('percent').value;
  new_ounces = document.getElementById('ounces').value;
  new_num_drinks = document.getElementById('num_drinks').value;
  new_drug= document.getElementById('dropdownDrug').value;
  console.log(new_time + "    " + new_percent + "    " + new_ounces + "   " + new_num_drinks);
  //  update output
  if(ensureFilled() == true) {
    updateOutput(new_gender, new_weight, new_time, new_percent, new_ounces, new_num_drinks, new_drug);
  } else {
    alert("not all fields are filled");
  }

};

//Ensures that all input fields are filled -- throws an alert if not
function ensureFilled() {
    if(document.getElementById('dropdownGender').value != null &&
        document.getElementById('w_value').value != null &&
        document.getElementById('time').value != null &&
        document.getElementById('percent').value != null &&
        document.getElementById('ounces').value != null &&
        document.getElementById('num_drinks').value != null) {
            return true
        } else {
            return false;
        }
}

function limitNegatives(input) {
    if (input.value < 0) input.value = 0;
}

// image to represent drunkness
var barImage = svg2.append("image")
  .attr("xlink:href", "bar.jpg")
  .attr("cx", width/2)
  .attr("cy", 50)
  .attr("height", height/2)
  .attr("width", width/2)

// for gausian blur filter
var defs = svg2.append("defs");


// function to draw the BAC graph
function updateGraph(currentBAC, time) {
    BACdata = [
            { "hour": 0, "bloodAlcConc": currentBAC }
        ];
    // calculate & BAC for next 5 hours
    var bac = currentBAC;
    var currhr = 0;
    for (i = 0; i < 10; i++) {
      // metabolize at .015 BAC per hour: https://www.lifeloc.com/measurement
      currhr = currhr + .5;
      bac = bac - .015;
      if (bac < 0) {
        bac = 0;
      }
      BACdata.push({ "hour": currhr, "bloodAlcConc": bac});
    }
    console.log(BACdata);

    // graph results: line chart from https://bl.ocks.org/mbostock/3883245
    x.domain(d3.extent(BACdata, function(d) { return d.hour; }));
    y.domain([0,.55])

    d3.select("g").remove();
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // draw x-axis
    g.append("g")
      .attr("transform", "translate(0," + height/2 + ")")
      .call(d3.axisBottom(x))
      .append("text")
      .attr("fill", "#000")
      .attr("x", width/2 - 4)
      .attr("dx", "0.71em")
      .attr("text-anchor", "end")
      .text("Hour");
    // draw y-axis
    g.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("BAC %");
    // add title
    g.append("text")
      .attr("x", (width / 4))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .attr('class', 'title')
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .text("BAC over next 5 hours");
    // draw line for legally imparied threshold
    var impairedLine = g.append("line")
      .style("stroke", "green")
      .attr("x1", x(0))
      .attr("x2", x(5))
      .attr("y1", y(.08))
      .attr("y2", y(.08));
    // add label for legal limit threshold line
    g.append("text")
      .attr("x", (width / 2) - 110)
      .attr("y", height / 2 + 35)
      .attr("text-anchor", "middle")
      .attr('class', 'title')
      .style("font-size", "10px")
      .text("*green line represents .08% BAC Legal Limit");

    //draw BAC line
    var path = g.append("path")
        .datum(BACdata)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 3)
        .attr("d", line);
    // animate path
    var totalLength = path.node().getTotalLength();
    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .delay(300)
      .duration(13000)
      .attr("stroke-dashoffset", 0);

}
