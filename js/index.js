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

var gender_options = ["male", "female"];

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



    // about person
    var gender;
    var weight;

    // about their drinking behavior
    var numDrinks;
    var ounces;
    var percentage;
    var hours;

    function alcoholContent(num, ounces, percentage) {
        var alc = num * ounces * percentage;
        return alc;
    }

    var alcohol;

    // blood alcohol content
    var currentBAC;


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

  // test
  weight = 170;
  hours = 4.5;
  alcohol = alcoholContent(7, 12, 0.05);
  gender = "male";
  console.log("alcohol: " + alcohol);
  currentBAC = BACcalculator(weight, gender, alcohol, hours);
  console.log(currentBAC);


  // BROKEN - IDK HOW TO GET INPUTS FROM FORM
    document.getElementById('w_submit').onclick = function(){
        new_weight = document.getElementById('w_value').value;
        console.log(new_weight);
    };

    document.getElementById('d_submit').onclick = function(){
        new_time = document.getElementById('time').value;
        new_percent = document.getElementById('percent').value;
        new_ounces = document.getElementById('ounces').value;
        new_num_drinks = document.getElementById('num_drinks').value;
        
        console.log(new_time + "    " + new_percent + "    " + new_ounces + "   " + new_num_drinks);
    };
  // numDrinks = document.forms["drinkingInputs"].getElementsByTagName("numDrinksInput");
  // percentage =   document.forms["drinkingInputs"].getElementsByTagName("percentageInput");
  // ounces = document.forms["drinkingInputs"].getElementsByTagName("ouncesInput");
  // hours = document.forms["drinkingInputs"].getElementsByTagName("hoursInput");

  // alcohol = alcoholContent(numDrinks, ounces, percentage);
  // currentBAC = BACcalculator(weight, gender, alcohol, hours);









  //var drunkness = d3.circle();




   var effects;

   function currentEffects(currentBAC) {
         if (currentBAC < .02) {
           effects = "not significant effects"
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
         } else {
             effects = "Coma is possible. This is the level of surgical anesthesia. "
         }
    return effects;
  }

  effects = currentEffects(currentBAC)
  console.log("current effcts: " + effects)

  // print current BAC
  document.getElementById("currBAC").innerHTML = currentBAC;

  // print current effects
  document.getElementById("currEffects").innerHTML = effects;
