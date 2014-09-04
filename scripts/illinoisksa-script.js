(function() {
console.log('Hello World!');
database['new key1']= 'Test item';
database['new key2']= "Test item";
var test = 10;
return {output1 : 'Test', output2 : test};
})()




// keyword : 골프
http://illinoisksa.org/xe/?act=&vid=&mid=fleamarket&category=&search_keyword=%EA%B3%A8%ED%94%84&search_target=title_content

(function() {
	var articleId = parseInt(jQuery('.board_list tbody tr').eq(3).find('.no').text(), 10);
	var articleTitle = jQuery('.board_list tbody tr').eq(3).find('.title').text().trim();
	var articleLink = jQuery('.board_list tbody tr').eq(3).find('.title a').attr('href');
	var articleDate = jQuery('.board_list tbody tr').eq(3).find('.time').text();

	if (!database) {
		throw new Error('No database found!');
	} else if (!database.newestArticleId || database.newestArticleId < articleId) {
		// update database
		database.newestArticleId = articleId;
		return {
			articleId: articleId,
			articleTitle: articleTitle,
			articleLink: articleLink,
			articleDate: articleDate
		}	
	} else {
		// If condition is not met, just return null
		return null;
	}	
})();







// Article link 클릭
http://illinoisksa.org/xe/index.php?mid=fleamarket&search_keyword=%EA%B3%A8%ED%94%84&search_target=title_content&document_srl=355213

var articleText = jQuery('.read_body').text().trim();
var searchedIndexes = [];
var curIndex = 0;
while (0 <= curIndex && curIndex < articleText.length) {
	var searchedIndex = articleText.substring(curIndex + 1).search(/골프|golf/i);
	if (searchedIndex < 0) {
		curIndex = -1;
	} else {
		searchedIndex += curIndex + 1;
		curIndex = searchedIndex;
		searchedIndexes.push(searchedIndex);
	}
}

var searchedTexts = [];
var i = 0, len = searchedIndexes.length;
for ( ; i < len ; i++) {
	var index = searchedIndexes[i];
	var left = Math.max(0, index - 10);
	var right = Math.min(articleText.length - 1, index + 10);
	console.log('i=%d, left=%d, right=%d', index, left, right);
	var searchedText = articleText.substring(left, right);
	console.log(searchedText);
	searchedTexts.push(searchedText);
}	
console.log(searchedTexts);

return {searchedTexts: searchedTexts};










console.log('Hello World!');
database['new key1']= 'Test item';
database['new key2']= "Test item";
var test = 10;
return {output1 : 'Test', output2 : test};
})()