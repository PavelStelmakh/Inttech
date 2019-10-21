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
            try
            {
                labaExecution(args);
            } catch (Exception ex)
            {
                FileService.Log(ex.Message);
                Console.WriteLine(ex.Message);
                Console.ReadKey();
            }
        }

        static void labaExecution(string[] args)
        {
            string fileIn = "", fileOut = "", type = "";
            try
            {
                fileIn = args[1];
                fileOut = args[2];
                type = args[3];
            }
            catch (IndexOutOfRangeException ex)
            {
                FileService.Log(ex.Message);
                Console.WriteLine("args: input_file, output_file and type(json or xlsx)");
                Console.ReadKey();
                return;
            }

            if (!type.Equals("json") && !type.Equals("xlsx"))
            {
                FileService.Log("type must be only json or xlsx");
                Console.WriteLine("type must be only json or xlsx");
                Console.ReadKey();
                return;
            }

            if (!File.Exists(fileIn + ".csv"))
            {
                FileService.Log("file not found");
                Console.WriteLine("file " + fileIn + " not found");
                Console.ReadKey();
                return;
            }

            //Performance[] students = FileService.ReadCSV<Performance>(fileIn);
            Performance[] students = FileService.ReadCSV(fileIn);
            IEnumerable<AvgScoreStudents> avgScoreStudents = students
                .Select(student => new AvgScoreStudents { student = student.Student, avgScore = student.Scores.Average(s => s.Score) });
            List<StudentScore> subjects = new List<StudentScore>();
            foreach(var s in students)
                foreach(var item in s.Scores)
                    subjects.Add(item);

            //students.Select(s => s.Scores.Select(item => {
            //    subjects.Add(item);
            //    return true;
            //}));
            IEnumerable<AvgScoreSubject> avgScoreSubject = subjects
                .GroupBy(s => s.Subject)
                .Select(group => new AvgScoreSubject { subject = group.Key, avgScore = group.Average(s => s.Score) });

            if (type.Equals("json"))
                FileService.SaveJson(fileOut, new SaveObjectJson { avgScoreStudents = avgScoreStudents, avgScoreSubject = avgScoreSubject });
            else
                FileService.SaveExcelStudents(fileOut, avgScoreStudents, avgScoreSubject);
        }
    }
}
