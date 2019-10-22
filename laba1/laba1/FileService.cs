using System;
using CsvHelper;
using Newtonsoft.Json;
using GemBox.Spreadsheet;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.IO;

namespace laba1
{
    static class FileService
    {
        static public Performance[] ReadCSV(string file)
        {
            CSVFormat[] data = null;
            using (StreamReader streamReader = new StreamReader(file + ".csv"))
            using (CsvReader csvReader = new CsvReader(streamReader))
            {
                csvReader.Configuration.Delimiter = ";";
                data = csvReader.GetRecords<CSVFormat>().ToArray();
            }
            CSVFormat[] dataScores = new CSVFormat[data.Length - 1];
            Array.Copy(data, 1, dataScores, 0, dataScores.Length);

            Performance[] result = dataScores.Select((item) => {
                string[] scores = item.Subject.Split(',');
                string[] subjects = data[0].Subject.Split(',');
                List<StudentScore> studentScores = new List<StudentScore>();
                for (int i = 0; i < subjects.Length; i++)
                {
                    string[] scoresBySem = scores[i].Split('/');
                    for (int j = 0; j < scoresBySem.Length; j++)
                    {
                        StudentScore studentScore = new StudentScore();
                        studentScore.Subject = subjects[i];
                        studentScore.Score = Int32.Parse(scoresBySem[j]);
                        studentScores.Add(studentScore);
                    }
                }

                return new Performance
                {
                    Student = item.Student,
                    Scores = studentScores.ToArray(),
                };
            }).ToArray();

            return result;
        }

        static public void SaveJson<T>(string file, T data)
        {
            JsonSerializer serializer = new JsonSerializer();
            using (StreamWriter sw = new StreamWriter(file + ".json"))
            using (JsonWriter writer = new JsonTextWriter(sw))
            {
                serializer.Serialize(writer, data);
            }
        }

        static public void SaveExcelStudents(string file, IEnumerable<AvgScoreStudents> avgScoreStudents, IEnumerable<AvgScoreSubject> avgScoreSubject)
        {
            SpreadsheetInfo.SetLicense("FREE-LIMITED-KEY");
            var workbook = new ExcelFile();
            var worksheet = workbook.Worksheets.Add(file);
            int index = 0;
            for (int i = 0; i < avgScoreStudents.Count(); i++, index++)
            {
                AvgScoreStudents students = avgScoreStudents.ElementAt(i);
                worksheet.Cells[index, 0].Value = students.student;
                worksheet.Cells[index, 1].Value = String.Format("{0:#0.00}", students.avgScore);
            }
            index++;
            for (int i = 0; i < avgScoreStudents.Count(); i++, index++)
            {
                AvgScoreSubject subject = avgScoreSubject.ElementAt(i);
                worksheet.Cells[index, 0].Value = subject.subject;
                worksheet.Cells[index, 1].Value = String.Format("{0:#0.00}", subject.avgScore);
            }
            workbook.Save(file + ".xlsx");
        }

        static public void Log(string message)
        {
            using (var file = new StreamWriter("log.txt"))
            {
                file.WriteLine(message);
            }
        }
    }
}
