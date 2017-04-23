function formatSlug(value) {
var formatted = value
                .toLowerCase()
                .replace(/ /g,'-')
                .replace(/[-]+/g, '-')
                .replace(/[^\w\x80-\xFF-]+/g,'');
return formatted;
}

function addUniqueSections(section, product, technology, region, global) {
  Sections.update({section: section}, {$set: {'section': section}}, {upsert: true});
  Sections.update({section: section}, {$set: {'product': product}}, {upsert: true});
  Sections.update({section: section}, {$set: {'technology': technology}}, {upsert: true});  
  Sections.update({section: section}, {$set: {'region': region}}, {upsert: true});
  Sections.update({section: section}, {$set: {'global': global}}, {upsert: true});

}
function addUniqueSection(section, technology) {
  Sections.update({section: section}, {$set: {'section': section}}, {upsert: true});
  Sections.update({section: section}, {$set: {'technology': technology}}, {upsert: true});
  var sectionId = Sections.findOne({section: section})._id;
  return sectionId;
}
function addUniqueQuestions(instructions) {
   var dup1 = Templates.findOne({instructions: instructions});
   console.log("dup1: "+dup1);
   return dup1;
}
Meteor.methods({
  parseUpload( data ) {
    check( data, Array );
    for ( i = 0; i < data.length; i++ ) {
      var thisSection = data[i].section;
      var thisProduct = data[i].product;
      var thisTechnology = data[i].technology;
      var thisRegion = Meteor.user().profile.region;
      var thisGlobal = true;
      var dup = Templates.findOne({'instructions': data[i].instructions});
      console.log("dup dup "+dup);
      if (dup){
        console.log("there was a duplicate");
      }
      else{
        Templates.insert(data[i]);
      }
//      Sections.update({section: data[i].section}, {upsert: true});

//      if(Sections.find({}, {section: {'data[i].section'}}){
//        console.log("duplicate");
//        }
//        else{
//          Sections.insert(data[i]);
//          console.log("added");
//        }

//      if(Sections.findOne('section': data[i].section, {$exists: false}}){
//        Sections.insert('section': data[i].section);
//      console.log("insert new section");
//      }
//      else{
//        console.log("skipping dup section");
//      }

      addUniqueSections(thisSection, thisProduct, thisTechnology, thisRegion, thisGlobal);
    }
  },
  newTemplate(section, technology){
    check( section, String );
    check( technology, String);
    var region = Meteor.user().profile.region;
    Templates.update({section: section}, {$set: {'section': section, 'region': region, 'global': true, 'description': '...', 'instructions': '....', 'expected': '.....'}}, {upsert: true});
    var sectionId = addUniqueSection(section, technology);
    return sectionId;
  }
});
