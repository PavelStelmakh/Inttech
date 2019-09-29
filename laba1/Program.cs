using System;
using CsvHelper;
using System.Collections;
using System.IO;

namespace laba1
{
    class Program
    {
        static void Main(string[] args)
        {
            string fileIn = args[1];
            string fileOut = args[2];

            using (StreamReader streamReader = new StreamReader(fileIn)) {
                using (CsvReader csvReader = new CsvReader(streamReader))
                {
                    csvReader.Configuration.Delimiter = ",";
                    IEnumerable programmingLanguages = csvReader.GetRecords<Performance>();
                }

            }

            foreach (string i in args) Console.WriteLine(i);

            Console.ReadKey();
        }
    }
}
