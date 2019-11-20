import scrapy

class WordsSpider(scrapy.Spider):
    name = "words"

    start_urls = ["https://www.spreadthesign.com/ru.ru/word/1"]
    
    def parse(self, response):
        # self.logger.info("")

        word = response.css("h2::text").get().strip()

        synonyms = response.css(".search-result")
        synonyms_data = [{
            "word": s.css("a::text").get().strip(),
            "url": s.css("a").xpath("@href").get(),
            "type": s.css("small::text").get().strip(),   
        } for s in synonyms if word != s.css("a::text").get().strip()]

        variants = []
        variants_data = []

        yield {
            "word": word,
            "video_link": response.css("video").xpath('@src').get(),
            "url": response.url,
            "synonyms": synonyms_data,
            "variants": variants_data
        }