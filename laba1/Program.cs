using System;
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
            string fileIn = "", fileOut = "", type = "";
            try
            {
                fileIn = args[1];
                fileOut = args[2];
                type = args[3];
            } catch
            {
                Console.WriteLine("args: input_file, output_file and type(json or xlsx)");
                Console.ReadKey();
                return;
            }

            if (!type.Equals("json") && !type.Equals("xlsx"))
            {
                Console.WriteLine("type must be only json or xlsx");
                return;
            }

            if (!File.Exists(fileIn + ".csv"))
            {
                Console.WriteLine("file " + fileIn + " not found");
                return;
            }

            Performance[] students = FileService.ReadCSV<Performance>(fileIn);
            IEnumerable<AvgScoreStudents> avgScoreStudents = students
                .GroupBy(s => s.Student)
                .Select(group => new AvgScoreStudents { student = group.Key, avgScore = group.Average(s => s.Score) });
            IEnumerable<AvgScoreSubject> avgScoreSubject = students
                .GroupBy(s => s.Subject)
                .Select(group => new AvgScoreSubject { subject = group.Key, avgScore = group.Average(s => s.Score) });

            if (type.Equals("json"))
                FileService.SaveJson(fileOut, new SaveObjectJson { avgScoreStudents = avgScoreStudents, avgScoreSubject = avgScoreSubject });
            else
                FileService.SaveExcelStudents(fileOut, avgScoreStudents, avgScoreSubject);
        }
    }
}
