all: 
	find . -name "*.ts" | xargs tsc -m amd -t ES5

clean: cleanjs cleanjsmap cleandts

cleanjs:
	rm -f *.js && rm -f **/*.js

cleanjsmap:
	rm -f *.js.map && rm -f **/*.js.map

cleandts:
	rm -f *.d.ts && rm -f **/*.d.ts

