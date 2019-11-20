import scrapy

BESE_URL = "https://www.spreadthesign.com"

class WordsSpider(scrapy.Spider):
    name = "words"
    allowed_domains = ["spreadthesign.com"]
    max_id = 16000  # max id I found 

    def start_requests(self):
            for i in range(self.max_id):
                yield scrapy.Request(
                    'https://www.spreadthesign.com/ru.ru/word/{0}'.format(i),
                    callback=self.parse
                )
                # time.sleep
    
    def parse(self, response):
        word = response.css("h2::text").getall()[1].strip()

        synonyms = response.css(".search-result")
        synonyms_data = [{
            "word": s.css("a::text").get().strip(),
            "url": s.css("a").xpath("@href").get(),
            "type": s.css("small::text").get().strip(),   
        } for s in synonyms if word != s.css("a::text").get().strip()]

        # TODO: some smarter stuff that ignore duplicates (or maybe scrapy will ignore pages automatically)
        variant_urls = response.css(".search-result-content").css(".nav-tabs").css("a").xpath("@href").getall()[1:]
        for url in variant_urls:
            yield scrapy.Request(
                BESE_URL + url,
                callback=self.parse
            )

        yield {
            "word": word,
            "video_link": response.css("video").xpath('@src').get(),
            "url": response.url,
            "synonyms": synonyms_data,
        }