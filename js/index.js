// layout based on: http://blockbuilder.org/Jverma/076377dd0125b1a508621441752735fc
var margin = {top: 40, right: 50, bottom: 40, left:50};
var width = +700 - margin.left - margin.right;
var height = +575 - margin.top - margin.bottom;
var svg = d3.select('body')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// setup
var currentBAC = 0;
var gender;
var gender_options = ["male", "female"];
var drug;
var drug_options = ["None", "Caffeine", "Cannabis", "Cocaine","Opiods", "Amphetamines", "Shrooms", "MDMA", "MAOIs", "Benzodiazepines", "PCP", "SSRIs"]

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

function alcoholContent(num, ounces, percentage) {
    var alc = num * ounces * (percentage * .01);
    return alc;
}

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
   if (currentBAC < .02) {
     effects = "no significant effects"
   } else if (currentBAC < .03){
       effects = "No loss of coordination, slight euphoria and loss of shyness. Depressant effects are not apparent. Mildly relaxed and maybe a little lightheaded."
   } else if (currentBAC < .06){
         effects = "Feeling of well-being, relaxation, lower inhibitions, sensation of warmth. Euphoria. Some minor impairment of reasoning and memory, lowering of caution. Your behavior may become exaggerated and emotions intensified (Good emotions are better, bad emotions are worse)"
   } else if (currentBAC < .09){
       effects = "Slight impairment of balance, speech, vision, reaction time, and hearing. Euphoria. Judgment and self-control are reduced, and caution, reason and memory are impaired, .08 is legally impaired and it is illegal to drive at this level. You will probably believe that you are functioning better than you really are."
   } else if (currentBAC < .125){
       effects = "Significant impairment of motor coordination and loss of good judgment. Speech may be slurred; balance, vision, reaction time and hearing will be impaired. Euphoria."
   } else if (currentBAC < .15){
       effects = "Gross motor impairment and lack of physical control. Blurred vision and major loss of balance. Euphoria is reduced and dysphoria (anxiety, restlessness) is beginning to appear. Judgment and perception are severely impaired."
   } else if (currentBAC < .19){
       effects = "Dysphoria predominates, nausea may appear. The drinker has the appearance of a \"sloppy drunk.\""
   } else if (currentBAC < .20){
       effects = "Feeling dazed, confused or otherwise disoriented. May need help to stand or walk. If you injure yourself you may not feel the pain. Some people experience nausea and vomiting at this level. The gag reflex is impaired and you can choke if you do vomit. Blackouts are likely at this level so you may not remember what has happened."
   } else if (currentBAC < .25){
       effects = "All mental, physical and sensory functions are severely impaired. Increased risk of asphyxiation from choking on vomit and of seriously injuring yourself by falls or other accidents."
   } else if (currentBAC < .30){
       effects = "STUPOR. You have little comprehension of where you are. You may pass out suddenly and be difficult to awaken."
   } else if (currentBAC > .30){
       effects = "Coma is possible. This is the level of surgical anesthesia. "
   } else {
     effects = "no effects"
   }
  return effects;
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

function updateOutput(gender, weight, time, percent, ounces, num_drinks, drug) {
  alcohol = alcoholContent(num_drinks, ounces, percent);
  currentBAC = BACcalculator(weight, gender, alcohol, time);
  if (currentBAC < 0) {
    currentBAC = 0;
  }
  console.log(currentBAC);
  var effects = currentEffects(currentBAC)
  console.log("current effects: " + effects)
  var combo = drugCombo(drug)
  console.log("current drug combo effects: " + combo)
  // print current BAC
  document.getElementById("currBAC").innerHTML = currentBAC;
  // print current effects
  document.getElementById("currEffects").innerHTML = effects;
  // print current drug effects
  document.getElementById("currDrugEffects").innerHTML = combo;
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

  // drunkness visualizations
  var bacSize = currentBAC * 100
    //size rectngle based on curren BAC
  drunkRect.transition().attr("height", bacSize).duration(4000);
    //Apply the blur filter to the drunk circle element
  barImage.style("filter", "url(#motionFilter)").duration(2000);
};

// onclick for drink details
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

<<<<<<< HEAD
function limitNegatives(input) {
    if (input.value < 0) input.value = 0;
}
=======
// rectangle to represent BAC level
var drunkRect = svg.append("rect")
  .attr("cx", width/2)
  .attr("cy", 25)
  .attr("width", 50)
  .attr("height", 10)
  .style("fill", "red");

// image to represent drunkness
var barImage = svg.append("image")
  .attr("xlink:href", "bar.jpg")
  .attr("cx", width/2)
  .attr("cy", 5)
  .attr("height", "550px")
  .attr("width", "550px")

// for gausian blur filter
var defs = svg.append("defs");
>>>>>>> 713736ccc16c696a34d39a64d53817f12ac9d314
