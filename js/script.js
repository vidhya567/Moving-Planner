
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

      // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");


    var street=$("#street").val();
    var city=$("#city").val();
    console.log(street);
    console.log(city);
    var locationmap=street+','+city;

    //google street view
    $greeting.text('So, you want to live at '+locationmap+'?');
    var imageurl="http://maps.googleapis.com/maps/api/streetview?size=600x300&location="+locationmap+'';
    $body.append('<img class="bgimg" src="'+imageurl+'">'); 
    
    //ny itmes articles
    var nyTimesBaseUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=';
    var nyTimesApiKey = '8d8526e16073485ab11a272a68bb5fbe';
    var nyadd='&sort=newest&api-key=';
    var nyTimesUrl = nyTimesBaseUrl + city + nyadd+ nyTimesApiKey;

    $.getJSON(nyTimesUrl,function(data){
     
      $nytHeaderElem.text('New York Times Articles about '+city);
      articles=data.response.docs;
      for(var i=0;i<articles.length;i++)
       {
         var article=articles[i];
         var classarticle='<li class="article">';
         var articleend='</li>';
         var para='<p>';
         var paraend='</p>';
         var headline='<a href="'+article.web_url+'">';
         var headlineend='</a>';
         $nytElem.append(classarticle+headline+article.headline.main+headlineend+para+article.snippet+paraend+articleend);  
       };

    }).error(function(){
        $nytHeaderElem.text('New York Times Articles could not be loaded');
    });
   
   var wikitime=setTimeout(function() {$wikiElem.text('Could not wikipedia links')}, 8000);
    //wikipedia
    var wikibaseurl='http://en.wikipedia.org/w/api.php?action=opensearch&search=';
    var addon='&format=json&callback=wikiCallBack';
    var wikiurl=wikibaseurl+city+addon;
    $.ajax({url:wikiurl,
            dataType:"jsonp",
            success:function(data){
                var articlelist=data[1];
                    for(var i=0;i<articlelist.length;i++)
                    {
                        articlew=articlelist[i];
                        var url='http://en.wikipedia.org/wiki/'+articlew;
                        var start='<li><a href="'+url+'">';
                        var link=start+articlew+'</a></li>';
                        $wikiElem.append(link);

                    }
                    clearTimeout(wikitime);
            }
        });
  

    return false;
};

$('#form-container').submit(loadData);
