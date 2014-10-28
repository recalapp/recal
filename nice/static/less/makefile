COMPILE=lessc

ARGS=-x

all: popup.css nice.css

clean:
	rm -f *.css

popup.css: popup.less
	$(COMPILE) $(ARGS) popup.less > popup.css

nice.css: nice.less
	$(COMPILE) $(ARGS) nice.less > nice_test.css
