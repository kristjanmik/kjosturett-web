To start:
  npm install
  npm start

Server starts on port 3000

##How do I build data?

All data lives in the data folder. To build the data run ./build.sh inside that folder(node v8 required). All the output goes to /data/build folder

##How does the reply string work?

When a person answers all the questions we generate a numerical sequence. Each number represent one question where:
-0 stands for first option, with value of *0*
-1 stands for first option, with value of *0.25*
-2 stands for first option, with value of *0.5*
-3 stands for first option, with value of *0.75*
-4 stands for first option, with value of *1*

If you

##Data sources

###/data/build/replies-candidates.json
```
[{"n":"Alþýðufylkingin","r":"01233012340123401234012401234"}]
```
.n represents name where .r represents the reply.
