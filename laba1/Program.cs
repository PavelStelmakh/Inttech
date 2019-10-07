using System;
//using CsvHelper;
//using CsvHelper.Excel;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.IO;

namespace laba1
{
    class Program
    {
        static void Main(string[] args)
        {
            string fileIn = args[1];
            string fileOut = args[2];

            using (StreamReader streamReader = new StreamReader(fileIn + ".csv")) {
                using (CsvReader csvReader = new CsvReader(streamReader))
                {
                    csvReader.Configuration.Delimiter = ",";
                    Performance[] students = csvReader.GetRecords<Performance>().ToArray();
                    var avgScoreStudents = students
                        .GroupBy(s => s.Student)
                        .Select(group => new { student = group.Key, avgScore = group.Average(s => s.Score) });
                    var avgScoreSubject = students
                        .GroupBy(s => s.Subject)
                        .Select(group => new { subject = group.Key, avgScore = group.Average(s => s.Score) });

                    //using (var writer = new StreamWriter(fileOut + ".xlsx"))
                    //{
                        using (var csvWriter = new CsvWriter(new ExcelSerializer("path/to/file.xlsx")))
                        {
                            csvWriter.WriteRecords(avgScoreStudents);
                            csvWriter.NextRecord();
                            csvWriter.WriteHeader<AvgScoreSubject>();
                            csvWriter.NextRecord();
                            csvWriter.WriteRecords(avgScoreSubject);
                        }
                    //}
                }

            }

            //foreach (string i in args) Console.WriteLine(i);

            //Console.ReadKey();
        }
    }
}
