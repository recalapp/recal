COMPILE=lessc

ARGS=-x

all: main.css

clean:
	rm -f *.css

main.css: main.less nice.less header.less course-search.less calendar.less modal.less
	$(COMPILE) $(ARGS) main.less > main.css

%.css: %.less
	$(COMPILE) $(ARGS) $^ > $@
