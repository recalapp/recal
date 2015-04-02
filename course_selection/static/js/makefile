all: 
	find . -name "*.ts" | xargs tsc -m amd -t ES5

clean: cleanjs cleanjsmap

cleanjs:
	rm -f *.js && rm -f **/*.js

cleanjsmap:
	rm -f *.js.map && rm -f **/*.js.map

