'use strict';

//SENTIMENTS, EMOTIONS, and SAMPLE_TWEETS have already been "imported"

/* Your script goes here */

console.log(SAMPLE_TWEETS);

//Print out the first three elements from the SAMPLE_TWEETS
console.log(SAMPLE_TWEETS.slice(0,3));


//function that take a tweet's text (a string) and split it up into a list of individual words

function extract_words(text_input)
{

var sm_text=text_input.toLowerCase();
var words = sm_text.split(/\W+/);


var array_cleaned = words.filter(function(x) {
    return (x.length) > 1;
});


return array_cleaned;
 
}
//call and print function output:
var text="Amazingly, I prefer a #rainy day to #sunshine.";
var wrd=extract_words(text);
console.log(wrd);



//function that filters a list of the words to get only those words that contain a specific emotion
function get_words_with_emotion(sample_word, emotion)
{
var ext_wrd=extract_words(sample_word);

var filtered_array=[];
for (var x in ext_wrd)

{   
    if(Object.keys(SENTIMENTS).indexOf(ext_wrd[x]) > -1)
    {
        
        var new_obj=SENTIMENTS[ext_wrd[x]];
        
        var obj_key=Object.keys(new_obj);
        for (var j in obj_key)
        {
            if(obj_key[j]===emotion){
                
                filtered_array.push(ext_wrd[x]); 
            }
        }
        
    }
 
      
}
return filtered_array;
}


//call and print function:
var word_emo=get_words_with_emotion(text, "positive");
console.log(word_emo);


//function that determines which words from a list have each emotion
function get_all_emotion_words(words)
{
    var p_arr={}
    for (var m in EMOTIONS)
    { 
        
        var p=get_words_with_emotion(words,EMOTIONS[m]);
        
        p_arr[EMOTIONS[m]]=p;
    }

return p_arr;
}

//call and print function:
var all_emo=get_all_emotion_words(text);
console.log(all_emo);




//Most common word:
// function that gets a list of the "most common" words in a list
function most_common(word_arr)
{
    var output = {};
    word_arr.forEach(function(item) {
        item in output ? output[item] += 1 : output[item] = 1;
    });
    var arr = Object.keys(output).sort(function(a, b) {
        return output[a] < output[b];
    });
    return arr;
}
//call and print function:
var mc=most_common(['a','b','c','c','c','a']);
console.log(mc);



//Tweet Statistics:

    function parse_tweets(tweets){

        tweets.forEach(function(item){
       
        var u= item.text;
        var r=extract_words(u);
        item["words"]=r
        
        var k=get_all_emotion_words(u)
        
        item["sentiments"]=k
    })



for (var i in tweets)
    {
        tweets[i]['hashtags'] = [] // empty array
        
    for (var j in tweets[i]['entities']['hashtags']){
        var hashtag = tweets[i]['entities']['hashtags'][j]['text'];
        
        
        tweets[i]['hashtags'].push(hashtag.toLowerCase());
    }
}

}

   
//Function to get hashtags for each emotion

    function get_emotion_hashtags(tweets,emotion){
        var hashtags =[]
        var hash = []
        for (var i in tweets){
            if (tweets[i]['sentiments'][emotion].length > 0){
                hashtags.push(tweets[i]['hashtags'])
            }
        }
        for (var i in hashtags){
            if (hashtags[i]!=""){
                hash.push(hashtags[i])
            }
        }
        return hash
    }

    


    function combine(x, y)
   {
    var o=x+y;
    return (o);

   }
//Analyze tweets:

//count of number of words in all tweets:

function analyze_tweets(tweets)
{
parse_tweets(tweets)
   function count_no_of_words(tweets)
   {
   var len_each=[]
   tweets.forEach(function(item){
    
     var u= item.text;
     var r=extract_words(u);
    len_each.push(r.length)
   })
     
    
     var no_of_words = len_each.reduce(combine)
    
    return(no_of_words)
}``

//Total no of words-
var no_words=count_no_of_words(tweets)
console.log(no_words)


var data={};
data['total_word_count']=no_words;


function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
  }

for(var em in EMOTIONS)
{
    data[EMOTIONS[em]] = {}
var particular_emo=[]
var single
for (var i in tweets)
{   
    single=(tweets[i].sentiments[EMOTIONS[em]])
    particular_emo.push(single)
   
}


  var all_emotion_words=flatten(particular_emo)
  
  data[EMOTIONS[em]]['count'] = all_emotion_words.length

  data[EMOTIONS[em]]['words'] = most_common(all_emotion_words)
 
  
   data[EMOTIONS[em]]['hashtags'] = most_common(get_emotion_hashtags(tweets, EMOTIONS[em]))
}


return data;
}


//Display the tweet statistics
function showEmotionData(analyze)
{
    document.getElementById("emotionsTableContent").innerHTML = "";

   
for (var line in analyze)
{   
    if(line!='total_word_count')
    {
    
    
    var div = d3.select('#emotionsTableContent').append('tr');  //get reference to the <div>
    
    div.text(line);
   
    div.append('td').text((((analyze[line].count)/(analyze['total_word_count']))*100).toFixed([2]));
   
    div.append('td').text((analyze[line].words.slice(0,3)));

    
   
    if(analyze[line].hashtags=="")
    {
        div.append('td').insert('tr').insert('td').text(" ");
    }
    if(analyze[line].hashtags!="")
    {
    div.append('td').text('#'+(analyze[line].hashtags.slice(0,3)).join('#'));
    }

    }
}
}

//Function to load the tweets
async function loadTweets(username)
{
    var uri = 'https://faculty.washington.edu/joelross/proxy/twitter/timeline/'+'?'+'screen_name='+username;
    var live_data = await d3.json(uri);  //wait for the asynchronous download to finish
                                //will now return the data downloaded instead of the Promise
    console.log(live_data);
    var analyze=analyze_tweets(live_data)
    showEmotionData(analyze)


    // if(username==="SAMPLE_TWEETS")
    // {
        // var analyze=analyze_tweets(SAMPLE_TWEETS)
         

    // }
}




//Button code:

var addButton=d3.select('#searchButton');
addButton.on('click',function(){
    var input=d3.select('input');
    var input_val=input.property('value');
    console.log(input_val)
    loadTweets(input_val)
})

showEmotionData(analyze_tweets(SAMPLE_TWEETS))
