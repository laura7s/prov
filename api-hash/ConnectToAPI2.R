r <- "http://rmb.reuters.com/rmd/rest/xml/"

authToken ="3SDnXO+c5Nf41yekCGEsDbdL2KkRT5cC81kIX5wuiTI";

# CHANNELS METHOD TO GET ALL CHANNELS
method = "channels"
service_url <- paste0(r, method , "?")
channels <- httr::GET(service_url,
                      httr::add_headers(
                        "XpressAccess-Token" = authToken,
                        "Content-Type"="application/xml"
                        ));

# PUT DATA IN DATAFRAME
require(XML)
data <- xmlParse(channels)
xml_data <- xmlToDataFrame(data)
# CHANNELS METHOD TO GET SPECIFIC CHANNEL DATA
service_url <- NULL
service_url <- paste0(r, method , "?", "channel=", "TRn222")
per_channels <- httr::GET(service_url,
                          httr::add_headers(
                            "XpressAccess-Token" = authToken,
                            "Content-Type"="application/xml"
                          ));

data <- xmlParse(per_channels)
xml_data <- xmlToDataFrame(data)
# GET CONTENT
# ITEMS METHOD TO GET SPECIFIC CHANNEL DATA
method = "items"
service_url <- NULL
service_url <- paste0(r, method , "?", "channel=", "TRn222")
items_in_channels <- httr::GET(service_url,
                               httr::add_headers(
                                 "XpressAccess-Token" = authToken,
                                 "Content-Type"="application/xml"
                               ));
library(XML)
library(stringr)
library(digest)
library(jsonlite)
library(tm)

data <- xmlParse(items_in_channels)
xml_data <- xmlToDataFrame(data)
method = "item"

hashes = c()
titles = c()
texts = c()
mylist = list()

counter = 1

for (item in 1:nrow(xml_data)) {
  mediaType <- xml_data[item,]$mediaType    # i.e. T for text, P for picture...
  previewUrl <- xml_data[item,]$previewUrl
  
  if (!is.na(mediaType) & mediaType == 'T') { # this is a text article
    id = xml_data[item,]$id
    title = xml_data[item,]$headline
    text_url = paste0(r, method , "?", "id=", id, "&token=", authToken)
    
    web_page_content <- readLines(text_url)
    web_page_content_to_string = paste(web_page_content,collapse="")
    
    # get text between body html tags
    web_page_body = sub(".*<body>", "", web_page_content_to_string)
    web_page_body = sub("<\body>*.", "", web_page_body)
    # remove remaining html tags
    web_page_body = gsub("<.*?>", "", web_page_body)
    # web_page_body = str_replace_all(web_page_body, "[^[:alnum:]]", "")
    # out initial attempt to compare hashes, we eventually moved to BoW methods
    text_to_hash = digest(web_page_body, "sha256")
    hashes = c(hashes, text_to_hash)
    titles = c(titles, title)
    texts = c(texts, web_page_body)
    
    x <- list(title = title, text = web_page_body)
    mylist[[counter]] <- x
    
    counter = counter + 1;
  }
  
}

json_out = toJSON(mylist, pretty = TRUE, auto_unbox = TRUE)
write(json_out, file = "json_out2.json")
